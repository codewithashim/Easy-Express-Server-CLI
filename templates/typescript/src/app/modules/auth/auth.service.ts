import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Profile } from "../profile/profile.model";
import { IUser, ILoginUser, IChangePassword, ILoginUserResponse, IRefreshTokenResponse } from "../user/user.interface";
import ApiError from "../../../shared/core/errors/api.error";
import { envConfig } from "../../../shared/config/environment.config";
import { Types, model, Schema } from "mongoose";
import { jwtHelpers } from "../../../shared/utils/jwt/jwt.utils";
import { v4 as uuidv4 } from 'uuid';

// Refresh Token Schema
const refreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true }
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

// Login Attempt Schema
const loginAttemptSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date }
});
const LoginAttempt = model('LoginAttempt', loginAttemptSchema);

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 3;
const LOGIN_BLOCK_DURATION = 15 * 60 * 1000;

const generateTokens = async (userId: Types.ObjectId, role: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = jwtHelpers.createToken(
        { id: userId, role },
        envConfig.jwt.secret as string,
        envConfig.jwt.expiresIn as string
    );
    const refreshToken = uuidv4();

    await RefreshToken.create({
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    return { accessToken, refreshToken };
};

const signUp = async (userData: Partial<IUser>): Promise<IUser> => {
    const session = await User.startSession();
    session.startTransaction();

    try {
        const newUser = await User.create([userData], { session });
        
        const { firstName, lastName } = userData as { firstName: string; lastName: string };
        await Profile.create([{ user: newUser[0]._id, firstName, lastName }], { session });

        await session.commitTransaction();
        return newUser[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const signIn = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    // Check login attempts
    let loginAttempt = await LoginAttempt.findOne({ userId: user._id });
    if (loginAttempt && loginAttempt.attempts >= LOGIN_ATTEMPT_LIMIT) {
        const timeSinceLastAttempt = Date.now() - (loginAttempt.lastAttempt ? loginAttempt.lastAttempt.getTime() : 0);
        if (timeSinceLastAttempt < LOGIN_BLOCK_DURATION) {
            const remainingTime = Math.ceil((LOGIN_BLOCK_DURATION - timeSinceLastAttempt) / 60000);
            throw new ApiError(httpStatus.TOO_MANY_REQUESTS, `Too many login attempts. Please try again in ${remainingTime} minutes.`);
        }
    }

    if (!(await user.isPasswordMatched(password, user.password))) {
        if (!loginAttempt) {
            loginAttempt = new LoginAttempt({ userId: user._id });
        }
        loginAttempt.attempts += 1;
        loginAttempt.lastAttempt = new Date();
        await loginAttempt.save();
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    // Reset login attempts on successful login
    if (loginAttempt) {
        loginAttempt.attempts = 0;
        await loginAttempt.save();
    }

    const { accessToken, refreshToken } = await generateTokens(user._id, user.role);
    return { accessToken };
};

const signOut = async (refreshToken: string): Promise<void> => {
    await RefreshToken.deleteOne({ token: refreshToken });
};

const resetPassword = async (email: string): Promise<void> => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const resetToken = jwtHelpers.createToken(
        { id: user._id },
        envConfig.jwt.reset_secret as string,
        envConfig.jwt.refresh_expires_in as string
    );

    // Store reset token logic here (e.g., in user document or separate collection)
    // Send reset email logic here
};

const changePassword = async (userId: Types.ObjectId, payload: IChangePassword): Promise<void> => {
    const { oldPassword, newPassword } = payload;
    const user = await User.findById(userId).select("+password");

    if (!user || !(await user.isPasswordMatched(oldPassword, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save();

    // Invalidate all refresh tokens for this user
    await RefreshToken.deleteMany({ userId: user._id });
};

const refreshToken = async (refreshToken: string): Promise<IRefreshTokenResponse> => {
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await User.findById(storedToken.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id, user.role);

    // Invalidate old refresh token
    await RefreshToken.deleteOne({ token: refreshToken });

    return { accessToken };
};


export const AuthService = {
    signUp,
    signIn,
    signOut,
    resetPassword,
    changePassword,
    refreshToken
};
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from "../user/user.interface";
import { User } from "../user/user.model";
import { jwtHelper } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { responseMessage } from "../../../constants/message";

const createUser = async (payload: IUser): Promise<IUser | null> => {
  try {
    const user = await User.create(payload);
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      responseMessage.INTERNAL_SERVER_ERROR_MESSAGE
    );
  }
};

const userLogin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        responseMessage.NOT_FOUND_MESSAGE
      );
    }

    const isPasswordMatch = await user.isPasswordMatched(
      password,
      user.password
    );
    if (!isPasswordMatch) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        responseMessage.INCORRECT_PASSWORD_MESSAGE
      );
    }

    const { role, email: userEmail, name, phone, id, profile } = user;
    const accessToken = jwtHelper.createToken(
      { role, email: userEmail, name, phone, id, profile },
      config.jwt.secret as Secret,
      config.jwt.expiresIn as string
    );

    const refreshToken = jwtHelper.createToken(
      { role, email: userEmail, name, phone, id },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires as string
    );

    return {
      accessToken,
      refreshToken,
      id,
      name,
      phone,
      email: userEmail,
      role,
      profile,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      responseMessage.INTERNAL_SERVER_ERROR_MESSAGE
    );
  }
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, responseMessage.INVALID_REFRESH_TOKEN);
  }
  const { email, role, name, phone, id, profile } = verifiedToken;
  const user = new User();
  const isUserExist = await user.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, responseMessage.USER_NOT_EXIST);
  }

  if (role !== "Admin") {
    throw new ApiError(httpStatus.FORBIDDEN, responseMessage.FORBIDDEN_MESSAGE);
  }

  const newAccessToken = jwtHelper.createToken(
    {
      id,
      name,
      email,
      phone,
      role,
      profile,
    },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ email: user?.email }).select(
    "+password"
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, responseMessage.USER_NOT_EXIST);
  }

  const isPasswordMatched = await isUserExist.isPasswordMatched(
    oldPassword,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      responseMessage.OLD_PASSWORD_ERROR
    );
  }

  isUserExist.password = newPassword;
  await isUserExist.save();
};

export const AuthService = {
  createUser,
  userLogin,
  refreshToken,
  changePassword,
};

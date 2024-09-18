import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import { ENUM_USER_ROLE } from "../../../shared/enums/user.enums";
import { envConfig } from "../../../shared/config/environment.config";

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        phone: {
            type: String,
            index: { unique: true },
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(ENUM_USER_ROLE),
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.password;
                return ret;
            },
        },
    }
);

UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(
            user.password,
            Number(envConfig.jwt.bcryptSalt)
        );
    }
    next();
});

UserSchema.methods.isUserExist = async function (
    email: string
): Promise<Partial<IUser> | null> {
    const user = await User.findOne(
        { email },
        {
            password: 1,
            id: 1,
            role: 1,
            name: 1,
            email: 1,
            phone: 1,
        }
    );
    return user;
};

UserSchema.methods.isPasswordMatched = async function (
    givenPassword: string,
    savedPassword: string
): Promise<boolean> {
    const isPasswordMatched = await bcrypt.compare(givenPassword, savedPassword);
    return isPasswordMatched;
};

export const User = model<IUser, UserModel>("User", UserSchema);
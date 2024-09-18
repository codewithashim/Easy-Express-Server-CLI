import { Model } from "mongoose";
import { ENUM_USER_ROLE } from "../../../shared/enums/user.enums";

export type IUser = {
    email: string;
    phone: string;
    password: string;
    role: ENUM_USER_ROLE;
};

export type IUserMethods = {
    isUserExist(email: string): Promise<Partial<IUser> | null>;
    isPasswordMatched(
        givenPassword: string,
        savedPassword: string
    ): Promise<boolean>;
};

export type ILoginUserResponse = {
    accessToken?: string;
};

export type IRefreshTokenResponse = {
    accessToken: string;
};

export type ILoginUser = {
    email: string;
    password: string;
};

export type IChangePassword = {
    oldPassword: string;
    newPassword: string;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

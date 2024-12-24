import { Model, Types } from "mongoose";
import { ENUM_USER_ROLE, ENUM_USER_STATUS } from "../../../shared/enums/user.enums";
import { IProfile } from "../profile/profile.interface";

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    phone: string;
    password: string;
    role: ENUM_USER_ROLE;
    status: ENUM_USER_STATUS;
    profile: Types.ObjectId | IProfile;
}

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
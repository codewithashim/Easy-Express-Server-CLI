import { Model } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";

export type IUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  profile: string;
  role: ENUM_USER_ROLE;
  password_reset_token?: {
    token: string;
    expires: Date;
  };
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
  refreshToken?: string;
  name?: string;
  email?: string;
  phone?:string;
  role?:string;
  id?: string;
  profile?:string;
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

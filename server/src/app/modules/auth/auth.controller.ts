import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from "../user/user.interface";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import config from "../../../config";
import { responseMessage } from "../../../constants/message";
import { logger } from "../../../shared/logger";
import { uploadOnCloudinary } from "../../middlewares/cloudinary/cloudinary";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData: IUser = req.body;

  if (!userData.phone) {
    logger.error(responseMessage.PHONE_NUMBER_REQUIRED_MESSAGE);
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: responseMessage.PHONE_NUMBER_REQUIRED_MESSAGE,
    });
  }

  let profileImageUrl: string | undefined;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      profileImageUrl = uploadResult.secure_url;
    }
  }

  if (profileImageUrl) {
    userData.profile = profileImageUrl;
  }

  const result = await AuthService.createUser(userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.SIGNUP_MESSAGE,
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const result = await AuthService.userLogin(loginData);

  const cookieOptions = {
    secure: config.env === "production" ? true : false,
    httpOnly: true,
  };

  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.SIGNIN_MESSAGE,
    data: {
      id: result.id,
      name: result.name,
      profile: result.profile,
      phone: result.phone,
      email: result.email,
      role: result.role,
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === "production" ? true : false,
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.REFETCH_TOKEN_MESSAGE,
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: responseMessage.PASSWORD_CHANGE_MESSAGE,
  });
});

export const AuthController = {
  createUser,
  userLogin,
  refreshToken,
  changePassword,
};

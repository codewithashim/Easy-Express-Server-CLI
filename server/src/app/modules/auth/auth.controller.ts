import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { IUser } from "../user/user.interface";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
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
  const data = req.body;
  const result = await AuthService.userLogin(data);
  res.cookie("accessToken", result, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.SIGNIN_MESSAGE,
    data: {
      token : result
    },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgetPassword(email);

  if (result === false) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
      data: null,
    });
  } else if (result && result.messageId) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:"Reset password link was sent to your email. Please check your inbox",
      data: null,
    });
  } else {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Something went wrong sending reset email",
      data: null,
    });
  }
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { userId, password } = req.body;
  await AuthService.resetPassword(userId, password);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your password was changed",
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body;
  const result = await AuthService.changePassword(
    userId,
    oldPassword,
    newPassword
  );

  if (!result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "Your old password was not correct",
      data: null,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your password was changed",
      data: null,
    });
  }
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout successful",
    data: null,
  });
});

export const AuthController = {
  createUser,
  userLogin,
  changePassword,
  logout,
  resetPassword,
  forgetPassword,
};

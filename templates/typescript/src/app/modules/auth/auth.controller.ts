import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/helpers/catchAsync.helper";
import sendResponse from "../../../shared/helpers/sendResponse.helper";
import { AuthService } from "./auth.service";
import { ILoginUserResponse, IRefreshTokenResponse } from "../user/user.interface";
import ApiError from "../../../shared/core/errors/api.error";

const signUp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signUp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signIn(req.body);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const signOut = catchAsync(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  await AuthService.signOut(req.user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful",
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  await AuthService.changePassword(req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.refreshToken(req.body);
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New access token generated successfully",
    data: result,
  });
});

export const AuthController = {
  signUp,
  signIn,
  signOut,
  resetPassword,
  changePassword,
  refreshToken,
};
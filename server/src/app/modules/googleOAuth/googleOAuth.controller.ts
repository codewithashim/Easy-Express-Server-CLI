import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { GoogleOAuthService } from "./googleOAuth.service";
import config from "../../../config";

const loginWithGoogle = catchAsync(async (req: Request, res: Response) => {
  if (req?.user) {
    const result: string = await GoogleOAuthService.loginWithGoogle(req.user);
    res.cookie("accessToken", result, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.redirect(config.google.redirectUrl);
  }
});

export const GoogleOAuthController = {
  loginWithGoogle
};

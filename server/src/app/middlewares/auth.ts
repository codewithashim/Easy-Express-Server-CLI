/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';

export const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.cookies.accessToken;
      
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelper.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; 

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

 

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log({ Cookies: req.cookies });
    console.log({ Token: req.cookies.accessToken });
    const token = req.cookies.accessToken;
    if (!token) {
      return res.json({
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Token not provided",
        data: null,
      });
    }

    const user: any = jwtHelper.verifyToken(token, config.jwt.secret as Secret);

    if (!user) {
      return res.json({
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Invalid token provided",
        data: null,
      });
    }

    req.id = user.id!;
    req.email = user.email!;

    next();
  } catch (error: any) {
    res.json({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "There was an error verifying the token",
      error: error.message,
    });
  }
};

 
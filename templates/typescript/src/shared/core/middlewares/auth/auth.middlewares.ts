import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import ApiError from '../../errors/api.error';
import { jwtHelpers } from '../../../utils/jwt/jwt.utils';
import { envConfig } from '../../../config/environment.config';

export const authGard =
    (...requiredRoles: string[]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.cookies.accessToken;

                if (!token) {
                    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
                }

                let verifiedUser = null;

                verifiedUser = jwtHelpers.verifyToken(token, envConfig.jwt.secret as Secret);

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

        const user: any = jwtHelpers.verifyToken(token, envConfig.jwt.secret as Secret);

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

export default { authGard, verifyJwt };
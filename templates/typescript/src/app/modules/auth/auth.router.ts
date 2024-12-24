import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../../shared/core/middlewares/validation/validate.request';
import { AuthValidation } from './auth.validation';
import { authGard, verifyJwt } from '../../../shared/core/middlewares/auth/auth.middlewares';
import { ENUM_USER_ROLE } from '../../../shared/enums/user.enums';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(AuthValidation.signUpZodSchema),
    AuthController.signUp
);

router.post(
    '/signin',
    validateRequest(AuthValidation.signInZodSchema),
    AuthController.signIn
);

router.post(
    '/signout',
    verifyJwt,
    AuthController.signOut
);

router.post(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordZodSchema),
    AuthController.resetPassword
);

router.post(
    '/change-password',
    validateRequest(AuthValidation.changePasswordZodSchema),
    authGard(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
    AuthController.changePassword
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenZodSchema),
    AuthController.refreshToken
);

export const AuthRoutes = router;
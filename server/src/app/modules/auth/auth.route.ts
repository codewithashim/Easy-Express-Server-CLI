import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createUserValidator } from "../user/user.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import upload from "../../middlewares/multer/multer";
const router = express.Router();

router.post(
  '/signup',
  upload.single('profile'),
  validateRequest(createUserValidator.createUserZodSchema),
  AuthController.createUser
);

router.post(
  "/login",
  validateRequest(createUserValidator.loginUserZodSchema),
  AuthController.userLogin
);

router.post(
  "/refresh-token",
  validateRequest(createUserValidator.refreshTokenSchema),
  AuthController.refreshToken
);

router.post(
  '/change-password',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.SUB_ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
  ),
  validateRequest(createUserValidator.changePasswordSchema),
  AuthController.changePassword
);


export const AuthRoutes = router;

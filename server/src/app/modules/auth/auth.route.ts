import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createUserValidator } from "../user/user.validation";
import { AuthController } from "./auth.controller";
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

router.delete("/logout", AuthController.logout);

router.post("/forget-password", AuthController.forgetPassword);

router.post("/reset-password", AuthController.resetPassword);

router.post("/change-password", AuthController.changePassword);


export const AuthRoutes = router;

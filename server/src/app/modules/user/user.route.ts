import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserValidator } from "./user.validation";
import { verifyJwt} from "../../middlewares/auth";
const router = express.Router();

router.get(
  "/",
 verifyJwt,
  UserController.getAllUsers
);
router.get(
  "/:id",
  verifyJwt,
  UserController.getUserById
);

router.patch(
  "/:id",
  verifyJwt,
  validateRequest(createUserValidator.updateUserZodSchema),
  UserController.updateUser
);
router.delete(
  "/:id",
  verifyJwt,
  UserController.deleteUser
);

router.get(
  "/my-profile/:id",
  verifyJwt,
  UserController.getUserById
);

router.patch(
  "/my-profile/:id",
  verifyJwt,
  validateRequest(createUserValidator.updateUserZodSchema),
  UserController.updateUser
);

export const UserRoutes = router;

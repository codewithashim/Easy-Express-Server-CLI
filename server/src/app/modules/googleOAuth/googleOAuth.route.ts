import { Router } from "express";
import passport from "passport";
const router = Router();
import { GoogleOAuthController } from "./googleOAuth.controller";

router.get(
  "/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  GoogleOAuthController.loginWithGoogle
);

export const GooglOAuthRoutes = router;

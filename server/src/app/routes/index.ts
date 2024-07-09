import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ExampleRoutes } from "../modules/example/example.route";
import { GooglOAuthRoutes } from "../modules/googleOAuth/googleOAuth.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/example",
    route: ExampleRoutes
  },
  {
    path: '/google/',
    route: GooglOAuthRoutes
  }
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

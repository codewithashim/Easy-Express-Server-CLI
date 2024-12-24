import express from "express";
import { AuthRoutes } from "../modules/auth/auth.router";

const routers = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },

];


moduleRoutes.forEach((route) => routers.use(route.path, route.route));

export default routers;
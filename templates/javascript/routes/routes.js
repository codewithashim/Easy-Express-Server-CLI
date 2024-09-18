import express from "express";
import userRouter from "./userRoutes.js";
import blogRoutes from "./blogRoutes.js";
import testimonialRoutes from "./testimonialRoutes.js";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/users",
        route: userRouter,
    },
    {
        path: "/blogs",
        route: blogRoutes,
    },
    {
        path: "/testimonials",
        route: testimonialRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
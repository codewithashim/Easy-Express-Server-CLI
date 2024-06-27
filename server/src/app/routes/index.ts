import express from 'express';
 
const router = express.Router();

const moduleRoutes = [
  
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;

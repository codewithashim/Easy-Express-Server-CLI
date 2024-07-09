import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      email?: string;
      user: JwtPayload | null;  
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
    email?: string;
  }
}

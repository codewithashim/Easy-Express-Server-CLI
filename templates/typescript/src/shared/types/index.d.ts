import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { IUser } from '../../app/modules/user/user.interface';

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

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
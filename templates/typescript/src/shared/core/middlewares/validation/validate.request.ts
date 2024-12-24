import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validateRequest = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(error);
            } else {
                next(error);
            }
        }
    };

export default validateRequest;
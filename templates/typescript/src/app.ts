import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import path from 'path';
import { stream } from './shared/core/logger/logger';
import globalErrorHandler from './shared/core/errors/globalErrorHandler';

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use('/api/v1/', routers);
app.use('/uploads', express.static(path.join(__dirname, 'public')));

app.use(globalErrorHandler);

app.use(morgan('combined', { stream }));

app.get('/', (req: Request, res: Response) => {
    res.json({
        sucess: true,
        message: `Welcome to ${process.env.APP_NAME} Server`,
        status: httpStatus.OK,
    })
});

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
export default app;
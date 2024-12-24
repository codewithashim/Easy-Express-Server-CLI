import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import httpStatus from 'http-status';
import ApiError from './api.error';
import castError from './cast.error';
import validationError from './validation.error';
import zodError from './zod.error';
import { logger } from '../logger/logger';
import { envConfig } from '../../config/environment.config';
import { IGenericErrorResponse } from '../../types/error.type';

type ErrorHandler = (error: any) => IGenericErrorResponse;

const handlers: Record<string, ErrorHandler> = {
    ValidationError: validationError,
    ZodError: zodError,
    CastError: castError,
    ApiError: (error: ApiError) => ({
        statusCode: error.statusCode,
        message: error.message,
        errorMessages: [{ path: '', message: error.message }],
    }),
    DatabaseError: (error: any) => ({
        statusCode: httpStatus.BAD_REQUEST,
        message: 'Database Error',
        errorMessages: [{ path: '', message: error.message }],
    }),
    DefaultError: (error: Error) => ({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        errorMessages: [{ path: '', message: error.message }],
    }),
};

const handleDatabaseError = (error: any): string => {
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        return 'DatabaseError';
    }
    if (error.sql || error.code === 'ER_DUP_ENTRY') {
        return 'DatabaseError'; // MySQL/MariaDB error
    }
    if (error.code && error.code.startsWith('23')) {
        return 'DatabaseError'; // PostgreSQL error
    }
    return 'DefaultError';
};

const globalErrorHandler: ErrorRequestHandler = (
    error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('🚨 Error caught in global error handler:', {
        error: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    let errorType: string;

    if (error instanceof ZodError) {
        errorType = 'ZodError';
    } else if (error instanceof ApiError) {
        errorType = 'ApiError';
    } else if (error.name === 'ValidationError') {
        errorType = 'ValidationError';
    } else if (error.name === 'CastError') {
        errorType = 'CastError';
    } else {
        errorType = handleDatabaseError(error);
    }

    const handler = handlers[errorType] || handlers.DefaultError;
    const { statusCode, message, errorMessages } = handler(error);

    const errorResponse: IGenericErrorResponse & { stack?: string, errorDetails?: any } = {
        statusCode,
        message,
        errorMessages,
        stack: envConfig.nodeEnv === 'development' ? error?.stack : undefined,
    };

    if (envConfig.nodeEnv !== 'production') {
        errorResponse.errorDetails = error;
    }

    logger.error('Error Response:', errorResponse);

    res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error = new ApiError(httpStatus.NOT_FOUND, `Not Found - ${req.originalUrl}`);
    next(error);
};

export default globalErrorHandler;

import mongoose from 'mongoose';
import { IGenericErrorMessage, IGenericErrorResponse } from '../../types/errorType';

const validationError = (
    error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
        (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: el?.path,
                message: el?.message,
            };
        }
    );
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages: errors,
    };
};

export default validationError;
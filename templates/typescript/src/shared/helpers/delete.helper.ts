import { Model, Document, Types } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../core/errors/api.error';

type DeleteOptions<T extends Document> = {
    checkExistence?: boolean;
    errorMessage?: string;
    cascadeDeletes?: Array<{ model: Model<any>; field: string }>;
    preDeleteHooks?: Array<(doc: T) => Promise<void>>;
    postDeleteHooks?: Array<(doc: T) => Promise<void>>;
};

export async function deleteDocument<T extends Document>(
    model: Model<T>,
    id: string | Types.ObjectId,
    options: DeleteOptions<T> = {}
): Promise<T | null> {
    const {
        checkExistence = true,
        errorMessage = 'Document not found',
        cascadeDeletes = [],
        preDeleteHooks = [],
        postDeleteHooks = [],
    } = options;

    try {
        const document = checkExistence 
            ? await model.findById(id) 
            : null;

        if (checkExistence && !document) {
            throw new ApiError(httpStatus.NOT_FOUND, errorMessage);
        }

        if (document) {
            await Promise.allSettled(preDeleteHooks.map(hook => hook(document)));
        }

        await Promise.allSettled(cascadeDeletes.map(({ model, field }) => 
            model.deleteMany({ [field]: id } as any)
        ));

        const result = await model.deleteOne({ _id: id } as any);

        if (result.deletedCount === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, errorMessage);
        }

        if (document) {
            await Promise.allSettled(postDeleteHooks.map(hook => hook(document)));
        }

        return document;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'An error occurred while deleting the document'
        );
    }
}
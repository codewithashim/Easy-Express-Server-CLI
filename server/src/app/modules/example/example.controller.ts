import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IExample } from "./example.interface";
import { ExampleService } from "./example.service";
import { responseMessage } from "../../../constants/message";

const createExample = catchAsync(async (req: Request, res: Response) => {
    const result = await ExampleService.createExample(req.body);

    sendResponse<IExample>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: responseMessage.CREATE_EXAMPLE_MESSAGE,
        data: result,
    });
});

const getAllExamples = catchAsync(async (req: Request, res: Response) => {
    const result = await ExampleService.getAllExamples();

    sendResponse<IExample[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: responseMessage.GET_ALL_EXAMPLES_MESSAGE,
        data: result,
    });
});

const getExampleById = catchAsync(async (req: Request, res: Response) => {
    const result = await ExampleService.getExampleById(req.params.id);

    sendResponse<IExample>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: responseMessage.GET_EXAMPLE_BY_ID_MESSAGE,
        data: result,
    });
});

const updateExample = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await ExampleService.updateExample(id, updatedData);

    sendResponse<IExample>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: responseMessage.UPDATE_EXAMPLE_MESSAGE,
        data: result,
    });
});

const deleteExample = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ExampleService.deleteExample(id);

    sendResponse<IExample>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: responseMessage.DELETE_EXAMPLE_MESSAGE,
        data: result,
    });
});

export const ExampleController = {
    createExample,
    getAllExamples,
    getExampleById,
    updateExample,
    deleteExample,
};

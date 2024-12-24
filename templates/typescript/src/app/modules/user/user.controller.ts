import { Request, Response } from "express";
import httpStatus from "http-status";
import { responseMessage } from "../../../shared/constants/response.message";
import { UserService } from "./user.service";
import { IUser } from "./user.interface";
import sendResponse from "../../../shared/helpers/sendResponse.helper";
import catchAsync from "../../../shared/helpers/catchAsync.helper";

// const getAllUsers = catchAsync(async (req: Request, res: Response) => {
//     const result = await UserService.getAllUsers();

//     sendResponse<IUser[]>(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: responseMessage.GET_ALL_USERS_MESSAGE,
//         data: result,
//     });
// });



export const UserController = {
    // getAllUsers,
};
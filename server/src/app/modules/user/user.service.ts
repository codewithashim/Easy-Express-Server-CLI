import ApiError from "../../../errors/ApiError";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import httpStatus from "http-status";
import { responseMessage } from "../../../constants/message";

const getAllUsers = async (): Promise<Array<IUser>> => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} get all user`
    );
  }
};

const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `User ${responseMessage.NOT_FOUND_MESSAGE}`
      );
    }
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} get user by ID`
    );
  }
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  try {
    const isExist = await User.findOne({ _id: id });
    if (!isExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `User ${responseMessage.NOT_FOUND_MESSAGE}`
      );
    }
    const updateUserData = payload;
    const result = await User.findOneAndUpdate({ _id: id }, updateUserData, {
      new: true,
    });
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} update user`
    );
  }
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `User ${responseMessage.NOT_FOUND_MESSAGE}`
      );
    }
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} delete user`
    );
  }
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

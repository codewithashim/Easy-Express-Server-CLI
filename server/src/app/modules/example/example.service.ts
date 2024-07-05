import ApiError from "../../../errors/ApiError";
import { Example } from "./example.model";
import { IExample } from "./example.interface";
import httpStatus from "http-status";
import { responseMessage } from "../../../constants/message";

const createExample = async (payload: IExample): Promise<IExample> => {
  const example = await Example.create(payload);
  return example;
};

const getAllExamples = async (): Promise<Array<IExample>> => {
  try {
    const examples = await Example.find();
    return examples;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} get all examples`
    );
  }
};

const getExampleById = async (id: string): Promise<IExample | null> => {
  try {
    const example = await Example.findById(id);
    if (!example) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Example ${responseMessage.NOT_FOUND_MESSAGE}`
      );
    }
    return example;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} get example by ID`
    );
  }
};

const updateExample = async (
  id: string,
  payload: Partial<IExample>
): Promise<IExample | null> => {
  try {
    const isExist = await Example.findOne({ _id: id });
    if (!isExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Example ${responseMessage.NOT_FOUND_MESSAGE}`
      );
    }

    const updatedExampleData = payload;

    const result = await Example.findOneAndUpdate({ _id: id }, updatedExampleData, {
      new: true,
    });
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} update example`
    );
  }
};

const deleteExample = async (id: string): Promise<IExample | null> => {
  try {
    const example = await Example.findByIdAndDelete(id);
    if (!example) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Example ${responseMessage.NOT_FOUND_MESSAGE}`
      );
    }
    return example;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE} delete example`
    );
  }
};

export const ExampleService = {
  createExample,
  getAllExamples,
  getExampleById,
  updateExample,
  deleteExample,
};

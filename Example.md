To add the example code snippets for the `example` entity CRUD operations in your `README.md` file, you can follow this structure:

1. **Overview of the Example Module**
2. **Interface**
3. **Model**
4. **Controller**
5. **Service**
6. **Route**
7. **Validation**

Here’s how you can add them to your `README.md`:

# Example Module

This module provides CRUD operations for the `example` entity. Below are the code snippets for the controller, interface, model, route, service, and validation.

## Interface

```typescript
import { Model } from "mongoose";

export type IExample = {
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ExampleModel =Model<IExample, Record<string, unknown>>;

```

## Model

```typescript
import { Schema, model } from "mongoose";
import { IExample, ExampleModel } from "./example.interface";

const ExampleSchema = new Schema<IExample>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Example = model<IExample, ExampleModel>("Example", ExampleSchema);

```

## Controller

```typescript
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IExample } from "./example.interface";
import { ExampleService } from "./example.service";
import { responseMessage } from "../../../constants/message";

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
  getAllExamples,
  getExampleById,
  updateExample,
  deleteExample,
};
```

## Service

```typescript
import ApiError from "../../../errors/ApiError";
import { Example } from "./example.model";
import { IExample } from "./example.interface";
import httpStatus from "http-status";
import { responseMessage } from "../../../constants/message";

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

    const updateExampleData = payload;

    const result = await Example.findOneAndUpdate({ _id: id }, updateExampleData, {
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
  getAllExamples,
  getExampleById,
  updateExample,
  deleteExample,
};

```


## Route

```typescript
import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ExampleController } from "./example.controller";
import { createExampleValidator } from "./example.validation";
const router = express.Router();

router.get("/", ExampleController.getAllExamples);
router.get("/:id", ExampleController.getExampleById);
router.patch(
  "/:id",
  validateRequest(createExampleValidator.updateExampleZodSchema),
  ExampleController.updateExample
);
router.delete("/:id", ExampleController.deleteExample);

export const ExampleRoutes = router
```

## Validation


```typescript
import { z } from "zod";

const createExampleZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
  }),
});

const updateExampleZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const createExampleValidator = {
  createExampleZodSchema,
  updateExampleZodSchema,
};

```

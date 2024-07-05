import { z } from "zod";

const createExampleZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
  }),
});

const updateExampleZodSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export const createExampleValidator = {
  createExampleZodSchema,
  updateExampleZodSchema,
};

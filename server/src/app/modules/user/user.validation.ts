import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: "Phone number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    role: z.enum(["User", "Admin", "Subadmin", "Superadmin"]),
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
  }),
});

const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      role: z.enum(["User", "Admin", "Subadmin", "Superadmin"]).optional(),
      password: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});

const refreshTokenSchema = z.object({
  cookie: z.object({
    refreshToken: z.string({
      required_error: "refreshToken is required",
    }),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "oldPassword is required",
    }),
    newPassword: z.string({
      required_error: "newPassword is required",
    }),
  }),
});

export const createUserValidator = {
  createUserZodSchema,
  updateUserZodSchema,
  refreshTokenSchema,
  loginUserZodSchema,
  changePasswordSchema,
};

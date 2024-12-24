import { z } from 'zod';

const signUpZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const signInZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const resetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6),
  }),
});

const refreshTokenZodSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const AuthValidation = {
  signUpZodSchema,
  signInZodSchema,
  resetPasswordZodSchema,
  changePasswordZodSchema,
  refreshTokenZodSchema,
};
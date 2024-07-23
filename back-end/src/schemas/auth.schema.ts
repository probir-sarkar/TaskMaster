import { z } from "zod";

export const googleCallbackSchema = z.object({
  name: z.string(),
  picture: z.string().optional(),
  email: z.string().email(),
  email_verified: z.boolean(),
  sub: z.string()
});

export const jwtPayloadSchema = z.object({
  id: z.number()
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string()
});

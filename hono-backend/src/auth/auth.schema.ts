import { z } from "zod";

export const SignUpRequestSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6)
});

export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

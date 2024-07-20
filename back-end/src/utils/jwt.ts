import jwt from "jsonwebtoken";
import env from "@/env";

export function verifyToken(token: string): object | string {
  return jwt.verify(token, env.jwtSecret);
}

export function generateToken(payload: object | string, expiresIn: string = "1d"): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: expiresIn,
  });
}

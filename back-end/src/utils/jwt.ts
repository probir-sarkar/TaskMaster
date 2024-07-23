import jwt from "jsonwebtoken";
import env from "@/env";

export function verifyToken(token: string): object | string {
  return jwt.verify(token, env.jwtSecret);
}

export function generateToken(payload: object | string, expiresIn: string = "1d"): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: expiresIn
  });
}

export function isTokenTimeExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload;
    if (!decoded) return true;
    const dateNow = new Date();
    const dateExpire = new Date(decoded.payload.exp * 1000);
    return dateNow > dateExpire;
  } catch (err) {
    return true;
  }
}

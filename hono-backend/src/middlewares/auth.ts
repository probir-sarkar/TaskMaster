import type { MiddlewareHandler } from "hono";
import { jwt, type JwtVariables } from "hono/jwt";

export type JWTPayload = {
  id: number;
  name: string | null;
  exp: number;
};

export type AppEnv = {
  Bindings: CloudflareBindings;
  Variables: JwtVariables<JWTPayload>;
};

// Created per-request so the secret comes from the request env (Cloudflare Workers).
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const middleware = jwt({ secret: c.env.JWT_SECRET, alg: "HS256", cookie: "token" });
  await middleware(c, next);
};

import { Hono } from "hono";
import { googleAuth } from "@hono/oauth-providers/google";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createDb } from "../db";
import { additionalInfo, users } from "../db/schema";
import { AppEnv, requireAuth } from "../middlewares/auth";
import { LoginRequestSchema, SignUpRequestSchema } from "./auth.schema";
import { generateToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";

export const authRoutes = new Hono<AppEnv>();

const TOKEN_COOKIE = "token";
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

const cookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: "None" as const,
  maxAge: TOKEN_MAX_AGE
});

// ---------------------------------------------------------------------------
// Google OAuth (redirect flow, handled by @hono/oauth-providers).
// The redirect URI is this route itself: DOMAIN/api/v1/auth/google
// ---------------------------------------------------------------------------
authRoutes.use("/google", (c, next) =>
  googleAuth({
    client_id: c.env.GOOGLE_CLIENT_ID,
    client_secret: c.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid", "email", "profile"]
  })(c, next)
);

authRoutes.get("/google", async (c) => {
  const clientUrl = c.env.CLIENT_URL;
  const token = c.get("token");
  const googleUser = c.get("user-google");

  if (!token || !googleUser) return c.redirect(`${clientUrl}/login?error=google_auth_failed`);
  if (googleUser.verified_email === false) return c.redirect(`${clientUrl}/login?error=email_not_verified`);

  const { email, name, picture } = googleUser;
  const db = createDb(c.env.DB);

  const found = await db.select().from(users).where(eq(users.email, email!));
  let user = found[0];

  if (!user) {
    const inserted = await db
      .insert(users)
      .values({ email: email!, name: name ?? null, photo: picture ?? null })
      .returning();
    const newUser = inserted[0];
    if (!newUser) return c.redirect(`${clientUrl}/login?error=user_creation_failed`);
    await db.insert(additionalInfo).values({ userId: newUser.id, signupMethod: "GOOGLE" });
    user = newUser;
  }

  const jwtToken = await generateToken({ id: user.id, name: user.name }, c.env.JWT_SECRET);
  setCookie(c, TOKEN_COOKIE, jwtToken, cookieOptions());
  return c.redirect(clientUrl);
});

// ---------------------------------------------------------------------------
// Signup
// ---------------------------------------------------------------------------
authRoutes.post("/signup", zValidator("json", SignUpRequestSchema), async (c) => {
  const { email, password, name } = c.req.valid("json");
  const db = createDb(c.env.DB);

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return c.json({ success: false as const, message: "Email already exists" }, 409);
  }

  const hashedPassword = await hashPassword(password);
  const inserted = await db.insert(users).values({ email, name }).returning();
  const user = inserted[0]!;
  await db.insert(additionalInfo).values({ userId: user.id, signupMethod: "EMAIL", password: hashedPassword });

  const token = await generateToken({ id: user.id, name: user.name }, c.env.JWT_SECRET);
  setCookie(c, TOKEN_COOKIE, token, cookieOptions());
  return c.json({ success: true as const, message: "Signup successfully" }, 201);
});

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
authRoutes.post("/login", zValidator("json", LoginRequestSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const db = createDb(c.env.DB);

  const found = await db
    .select()
    .from(users)
    .innerJoin(additionalInfo, eq(additionalInfo.userId, users.id))
    .where(eq(users.email, email));
  const row = found[0];

  if (!row) return c.json({ success: false as const, message: "Email not found" }, 401);
  const { users: user, additional_info: info } = row;

  if (info?.signupMethod === "GOOGLE")
    return c.json({ success: false as const, message: "Google account cannot login here" }, 401);

  if (!info?.password) return c.json({ success: false as const, message: "Password not found" }, 401);

  const isPasswordMatch = await verifyPassword(password, info.password);
  if (!isPasswordMatch) return c.json({ success: false as const, message: "Password is incorrect" }, 401);

  const token = await generateToken({ id: user.id, name: user.name }, c.env.JWT_SECRET);
  setCookie(c, TOKEN_COOKIE, token, cookieOptions());
  return c.json({ success: true as const, message: "Login successfully" }, 200);
});

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
authRoutes.get("/logout", (c) => {
  deleteCookie(c, TOKEN_COOKIE);
  return c.json({ success: true as const, message: "Logout successfully" }, 200);
});

// ---------------------------------------------------------------------------
// Verify (protected)
// ---------------------------------------------------------------------------
authRoutes.get("/verify", requireAuth, async (c) => {
  const payload = c.get("jwtPayload");
  const db = createDb(c.env.DB);

  const found = await db.select().from(users).where(eq(users.id, payload.id));
  const user = found[0];
  if (!user) return c.json({ success: false as const, message: "User not found" }, 401);

  return c.json(
    {
      success: true as const,
      message: "User is authenticated",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.photo,
        role: user.role,
        status: user.status
      }
    },
    200
  );
});

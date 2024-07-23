import { CookieOptions, Router } from "express";
import prisma from "@/configs/prisma";
import passport from "@/configs/passport";
import { googleCallbackSchema, signupSchema } from "@/schemas/auth.schema";
import { generateToken, verifyToken } from "@/utils/jwt";
import { authenticate } from "@/middlewares/authMiddleware";
import bcryptjs from "bcryptjs";

const router = Router();

export function cookieParams(): CookieOptions {
  return {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: '.probir.dev' // Set domain attribute if necessary
  };
}

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  async function (req, res) {
    if (!req.user) return res.status(500).json({ message: "Internal server error" });
    const verifiedUser = googleCallbackSchema.safeParse(req.user);
    if (!verifiedUser.success) return res.json({ message: "Missing Data From Google" });
    const user = verifiedUser.data;
    if (user.email_verified === false) return res.json({ message: "Google Email not verified" });
    const { email, name, picture, sub } = user;
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      const token = generateToken({ id: foundUser.id, name: foundUser.name });
      res.cookie("token", token, cookieParams());
      return res.redirect(`${process.env.CLIENT_URL}`);
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        photo: picture,
        additionalInfo: {
          create: {
            signupMethod: "GOOGLE"
          }
        }
      }
    });
    const token = generateToken({ id: newUser.id, name: newUser.name });
    res.cookie("token", token, cookieParams());
    return res.redirect(`${process.env.CLIENT_URL}`);
  }
);

router.get("/auth/logout", (req, res) => {
  res.cookie("token", "",{
    maxAge: 0, 
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: '.probir.dev' 
  });
  res.json({ message: "Logout successfully" });
});

router.get("/auth/verify", authenticate, (req, res) => {
  res.json({ success: true, message: "User is authenticated", user: req.user });
});

router.post("/auth/signup", async (req, res) => {
  const { email, password, name } = signupSchema.parse(req.body);

  const foundUser = await prisma.user.findUnique({ where: { email } });
  if (foundUser) return res.json({ message: "Email already exists", success: false, alreadyExists: true });
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      additionalInfo: {
        create: {
          signupMethod: "EMAIL",
          password: hashedPassword
        }
      }
    }
  });
  const token = generateToken({ id: user.id, name: user.name });
  res.cookie("token", token, cookieParams());
  res.json({ message: "Signup successfully", success: true });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  // Check if email exists
  const user = await prisma.user.findUnique({ where: { email }, include: { additionalInfo: true } });
  if (!user) return res.json({ message: "Email not found", success: false });

  if (user.additionalInfo?.signupMethod === "GOOGLE")
    return res.json({ message: "Google account cannot login here", success: false });

  if (!user.additionalInfo?.password) return res.json({ message: "Password not found", success: false });

  const isPasswordMatch = await bcryptjs.compare(password, user.additionalInfo.password);

  if (!isPasswordMatch) return res.json({ message: "Password is incorrect", success: false });

  const token = generateToken({ id: user.id, name: user.name });
  res.cookie("token", token, cookieParams());
  res.json({ message: "Login successfully", success: true });
});

export default router;

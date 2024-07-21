import { CookieOptions, Router } from "express";
import prisma from "@/configs/prisma";
import passport from "@/configs/passport";
import { googleCallbackSchema } from "@/schemas/auth.schema";
import { generateToken, verifyToken } from "@/utils/jwt";
import { authenticate } from "@/middlewares/authMiddleware";

const router = Router();

export function cookieParams(): CookieOptions {
  return {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  };
}

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async function (req, res) {
    if (!req.user) return res.status(500).json({ message: "Internal server error" });
    const verifiedUser = googleCallbackSchema.safeParse(req.user);
    if (!verifiedUser.success) return res.status(400).json({ message: "Missing Data From Google" });
    const user = verifiedUser.data;
    if (user.email_verified === false) return res.status(400).json({ message: "Google Email not verified" });
    const { email, name, picture, sub } = user;
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      const token = generateToken({ id: foundUser.id, name: foundUser.name });
      res.cookie("token", token, cookieParams());
      return res.redirect("http://localhost:5173/task");
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        photo: picture,
        additionalInfo: {
          create: {
            signupMethod: "GOOGLE",
          },
        },
      },
    });
    const token = generateToken({ id: newUser.id, name: newUser.name });
    res.cookie("token", token, cookieParams());
    return res.redirect("http://localhost:5173/task");
  }
);

router.get("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successfully" });
});

router.get("/auth/verify", authenticate, (req, res) => {
  res.json({ success: true, message: "User is authenticated", user: req.user });
});
export default router;

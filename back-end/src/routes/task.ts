import { CookieOptions, Router } from "express";
import { authenticate } from "@/middlewares/authMiddleware";

const router = Router();
// The authenticate middleware will be executed before the route handler
router.use(authenticate);

router.get("/task", (req, res) => {
  res.json({ message: "Hello from task route", user: req.user });
});

export default router;

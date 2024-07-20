import { CookieOptions, Router } from "express";

const router = Router();

router.get("/task", (req, res) => {
  res.json({ message: "Hello from task route" });
});

export default router;

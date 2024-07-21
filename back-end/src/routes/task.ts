import { CookieOptions, Router } from "express";
import { authenticate } from "@/middlewares/authMiddleware";
import { addTask, task } from "@/controllers/taskController";
import tryCatch from "@/utils/tryCatch";

const router = Router();
// The authenticate middleware will be executed before the route handler
router.use(authenticate);

router.get("/task", (req, res) => {
  res.json({ message: "Hello from task route", user: req.user });
});

router.post("/task/add", tryCatch(addTask));

export default router;

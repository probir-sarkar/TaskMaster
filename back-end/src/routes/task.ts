import { CookieOptions, Router } from "express";
import { authenticate } from "@/middlewares/authMiddleware";
import { addTask, getTasks, task, changePosition } from "@/controllers/taskController";
import tryCatch from "@/utils/tryCatch";

const router = Router();
// The authenticate middleware will be executed before the route handler
router.use(authenticate);

router.route("/task").get(tryCatch(getTasks)).post(tryCatch(addTask));

router.post("/task/change-position", tryCatch(changePosition));

export default router;

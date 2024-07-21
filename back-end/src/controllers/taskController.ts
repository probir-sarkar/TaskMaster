import { RequestHandler } from "express";
import { TaskSchema } from "@/schemas/task.schema";
export const task: RequestHandler = (req, res) => {
  res.json({ message: "Hello from task route", user: req.user });
};

export const addTask: RequestHandler = (req, res) => {
  res.json({ message: "Task created successfully" });
};

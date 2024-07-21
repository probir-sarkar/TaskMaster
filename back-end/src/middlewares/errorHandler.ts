import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: err.errors.map((error) => ({
        path: error.path,
        message: error.message,
      })),
    });
  }

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

import express, { Express } from "express";
import env from "@/env";
import cors from "cors";
import { errorHandler } from "@/middlewares/errorHandler";
import passport from "passport";
import cookieParser from "cookie-parser";

// Importing the routes
import authRoutes from "@/routes/auth";
import taskRoutes from "@/routes/task";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(passport.initialize());

app.get("/", (req, res) => res.send("Hello World from QuickEdit"));

// Using the routes
app.use(authRoutes);
app.use(taskRoutes);

// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.all("*", (req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler, must be the last middleware, It will handle all errors
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

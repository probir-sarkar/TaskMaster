import App from "@/App";
import Task from "@/pages/Task";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/Login";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/task",
    element: (
      // <ProtectedRoute>
      <Task />
      // </ProtectedRoute>
    ),
  },
];

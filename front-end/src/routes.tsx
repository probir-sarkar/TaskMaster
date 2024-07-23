import Task from "@/pages/Task";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/Login";
import NavBar from "./components/NavBar";
import SignUpPage from "./pages/Signup";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <NavBar>
          <Task />
        </NavBar>
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignUpPage />
  }
];

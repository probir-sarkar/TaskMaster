// src/hooks/useAuth.js
import { useState, useLayoutEffect } from "react";
import instance from "@/configs/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { FormValues as LoginFormData } from "@/pages/Login";
import type { FormValues as SignupFormData } from "@/pages/Signup";
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await instance.get("/auth/verify");
      if (!response.data.success) throw new Error("User is not authenticated");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await instance.get("/auth/logout");
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out", error);
      toast.error("Something went wrong");
    }
  };
  const loginWithGoogle = () => {
    try {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (error) {
      console.error("Error logging in with Google", error);
      toast.error("Something went wrong");
    }
  };
  const login = async (data: LoginFormData) => {
    const { email, password } = data;
    try {
      const response = await instance.post("/auth/login", { email, password });
      if (response.data.success) {
        toast.success("Logged in successfully");
        navigate("/");
      } else if (response.data.success === false) {
        toast.warning(response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error logging in", error);
      toast.error("Something went wrong");
    }
  };
  const signup = async (data: SignupFormData) => {
    const { name, email, password } = data;
    try {
      const response = await instance.post("/auth/signup", { name, email, password });
      if (response.data.success) {
        toast.success("Logged in successfully");
        navigate("/");
      } else if (response.data.success === false) {
        toast.warning(response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error signing up", error);
      toast.error("Something went wrong");
    }
  };

  return {
    logout,
    user,
    loading,
    loginWithGoogle,
    login,
    signup
  };
};

export default useAuth;

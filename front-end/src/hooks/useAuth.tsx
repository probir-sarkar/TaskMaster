// src/hooks/useAuth.js
import { useState, useLayoutEffect } from "react";
import instance from "@/configs/axios";
import { useNavigate } from "react-router-dom";

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
      navigate("/login");
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
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  const loginWithGoogle = () => {
    try {
      window.location.href = "http://localhost:8080/auth/google";
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  return {
    logout,
    user,
    loading,
    loginWithGoogle,
  };
};

export default useAuth;

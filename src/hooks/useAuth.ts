import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/authApi";
import type { LoginPayload, Teacher } from "../types/auth";

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeacher = (): Teacher | null => {
    const raw = localStorage.getItem("teacher");
    return raw ? JSON.parse(raw) : null;
  };

  const isAuthenticated = (): boolean => !!localStorage.getItem("token");

  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("teacher", JSON.stringify(res.teacher));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher");
    navigate("/login");
  };

  return { login, logout, loading, error, getTeacher, isAuthenticated };
}
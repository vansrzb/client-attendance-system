import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/authApi";
import type { LoginPayload } from "../types/auth";

type AuthUser = {
  id: number;
  email: string;
  full_name?: string;
};

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = (): AuthUser | null => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  };

  const getRole = (): string | null => {
    return localStorage.getItem("role");
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
  };

  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginApi(data);

      const { token, role, user } = res;

      if (!token || !role || !user) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "teacher") {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return {
    login,
    logout,
    loading,
    error,
    getUser,
    getRole,
    isAuthenticated,
  };
}

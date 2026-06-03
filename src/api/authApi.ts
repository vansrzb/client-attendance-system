import api from "./axios";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../types/auth";

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

export const register = async (
  data: RegisterPayload
): Promise<{ message: string }> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
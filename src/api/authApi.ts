import api from "./axios";
import type { LoginPayload, RegisterPayload, AuthResponse } from "../types/auth";

export const login = (data: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", data).then((r) => r.data);

export const register = (data: RegisterPayload) =>
  api.post("/auth/register", data).then((r) => r.data);
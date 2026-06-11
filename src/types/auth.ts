export interface Teacher {
  id: number;
  full_name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  role: "admin" | "teacher";
  user: {
    id: number;
    email?: string;
    full_name?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}
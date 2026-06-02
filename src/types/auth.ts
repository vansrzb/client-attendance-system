export interface Teacher {
  id: number;
  full_name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  teacher: Teacher;
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
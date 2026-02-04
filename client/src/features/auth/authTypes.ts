// src/features/auth/authTypes.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  loading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
  success: boolean;
}

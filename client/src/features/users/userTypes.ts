// src/redux/features/user/userTypes.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
  role?: "admin" | "user";
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

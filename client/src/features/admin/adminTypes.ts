export interface Admin {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  token?: string;

  // Optional profile fields
  phone?: string;
  address?: string;
  image?: string;
}

export interface AdminState {
  loading: boolean;
  admin: Admin | null;
  protectedData: unknown;
  error: string | null;
  success: boolean;
}

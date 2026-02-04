"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/store/axiosInstance";
import { AxiosError } from "axios";
import { User, AuthResponse, AuthState } from "./authTypes";

// ---------------------- Helper ----------------------
const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError)
    return err.response?.data?.message || err.message;
  if (err instanceof Error) return err.message;
  return "An unknown error occurred";
};

const saveAuthToStorage = (user: User, token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", token);
  }
};

const clearAuthFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }
};

// ---------------------- Async Thunks ----------------------

// Login
export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", formData);
    return data;
  } catch (err: unknown) {
    const status = (err as AxiosError)?.response?.status;
    const message =
      status === 429
        ? "Too many login attempts. Please try again later."
        : getErrorMessage(err);
    return rejectWithValue(message);
  }
});

// Google Login
export const googleLoginUser = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>("auth/googleLoginUser", async (token, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/google-login", {
      token,
    });
    return data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// Logout
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// ---------------------- Initial State ----------------------
let initialUser: User | null = null;
let initialToken: string | null = null;

if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("accessToken");
  initialUser = storedUser ? JSON.parse(storedUser) : null;
  initialToken = storedToken || null;
}

const initialState: AuthState = {
  loading: false,
  user: initialUser,
  token: initialToken,
  error: null,
  success: false,
};

// ---------------------- Slice ----------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      if (state.token) saveAuthToStorage(action.payload, state.token);
    },
    setUserToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      if (state.user) saveAuthToStorage(state.user, action.payload);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = false;
      clearAuthFromStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.success = true;
          saveAuthToStorage(action.payload.user, action.payload.token);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.success = false;
      })

      // Google Login
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        googleLoginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.success = true;
          saveAuthToStorage(action.payload.user, action.payload.token);
        }
      )
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google Login failed";
        state.success = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.success = false;
        clearAuthFromStorage();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
        state.user = null;
        state.token = null;
        state.success = false;
        clearAuthFromStorage();
      });
  },
});

export const { setUser, setUserToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/store/axiosInstance";
import type { AxiosError } from "axios";
import type { Admin, AdminState } from "./adminTypes";

/* -------------------------------
   Initial State
--------------------------------*/
let initialAdmin: Admin | null = null;
if (typeof window !== "undefined") {
  const storedAdmin = localStorage.getItem("admin");
  initialAdmin = storedAdmin ? (JSON.parse(storedAdmin) as Admin) : null;
}

const initialState: AdminState = {
  loading: false,
  admin: initialAdmin,
  protectedData: null,
  error: null,
  success: false,
};

/* -------------------------------
   Error utility
--------------------------------*/
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if ((error as AxiosError)?.response?.data) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? "Something went wrong";
  }
  return "Something went wrong";
};

/* -------------------------------
   Async Thunks
--------------------------------*/
export const adminLogin = createAsyncThunk<
  Admin,
  { email: string; password: string },
  { rejectValue: string }
>("admin/adminLogin", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/admin/login", formData);
    return response.data as Admin;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const logoutAdmin = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("admin/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/admin/logout");
    return true;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchProtectedAdminData = createAsyncThunk<
  unknown,
  void,
  { rejectValue: string }
>("admin/fetchProtectedData", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/protected");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const refreshAdminAccessToken = createAsyncThunk<
  { token: string },
  void,
  { rejectValue: string }
>("adminAuth/refreshAdminAccessToken", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/admin/refresh-token");
    return res.data as { token: string };
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchAdminProfile = createAsyncThunk<
  { payload: Admin },
  void,
  { rejectValue: string }
>("admin/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/admin/profile");
    return res.data as { payload: Admin };
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateAdminProfile = createAsyncThunk<
  Admin,
  FormData,
  { rejectValue: string }
>("admin/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put("/admin/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.payload as Admin;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

/* -------------------------------
   Slice
--------------------------------*/
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload)
          localStorage.setItem("admin", JSON.stringify(action.payload));
        else localStorage.removeItem("admin");
      }
    },
    clearAuth: (state) => {
      state.admin = null;
      state.error = null;
      state.protectedData = null;
      state.success = false;
      if (typeof window !== "undefined") localStorage.removeItem("admin");
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        state.admin = action.payload;
        state.success = true; // ✅ এখানে success ফ্ল্যাগ সেট করতে হবে
        if (typeof window !== "undefined") {
          localStorage.setItem("admin", JSON.stringify(action.payload));
        }
      })

      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })

      // Admin Logout
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.protectedData = null;
        if (typeof window !== "undefined") localStorage.removeItem("admin");
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = action.payload ?? "Logout failed";
        state.protectedData = null;
        if (typeof window !== "undefined") localStorage.removeItem("admin");
      })

      // Fetch Protected Data
      .addCase(fetchProtectedAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProtectedAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.protectedData = action.payload;
      })
      .addCase(fetchProtectedAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unauthorized";
      })

      // Refresh Token
      .addCase(refreshAdminAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAdminAccessToken.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(refreshAdminAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Admin refresh token failed";
      })

      // Fetch Profile
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminProfile.fulfilled,
        (state, action: PayloadAction<{ payload: Admin }>) => {
          state.loading = false;
          state.admin = action.payload.payload;
        }
      )
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      })

      // Update Profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateAdminProfile.fulfilled,
        (state, action: PayloadAction<Admin>) => {
          state.loading = false;
          state.admin = action.payload;
          state.success = true;
          if (typeof window !== "undefined")
            localStorage.setItem("admin", JSON.stringify(action.payload));
        }
      )
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Profile update failed";
        state.success = false;
      });
  },
});

export const { setAdmin, clearAuth, clearSuccess } = adminSlice.actions;
export default adminSlice.reducer;

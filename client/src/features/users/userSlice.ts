import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/store/axiosInstance";
import { User, UserState } from "./userTypes";

// ===============================
// Async Thunks
// ===============================

// Register User
export const registerUser = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("user/registerUser", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<{ payload: User }>(
      "/users/process-register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.payload || response.data;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message: string } } })?.response?.data
        ?.message || "Register failed";
    return rejectWithValue(message);
  }
});

// Verify / Activate User
export const verifyUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("user/verifyUser", async (token, { rejectWithValue }) => {
  try {
    const response = await api.post<{ payload: User }>("/users/verify", {
      token,
    });
    return response.data.payload || response.data;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message: string } } })?.response?.data
        ?.message || "Activation failed";
    return rejectWithValue(message);
  }
});

// Fetch Logged In User
export const getLoggedInUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/getLoggedInUser", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ payload: User }>("/users/me", {
      withCredentials: true,
    });
    return res.data.payload;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message: string } } })?.response?.data
        ?.message || "Failed to fetch user";
    return rejectWithValue(message);
  }
});

// Update Profile
export const updateLoggedInUser = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("user/updateLoggedInUser", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.patch<{ payload: User }>(
      "/users/update-profile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.payload;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message: string } } })?.response?.data
        ?.message || "Profile update failed";
    return rejectWithValue(message);
  }
});

// ===============================
// Slice
// ===============================
const initialState: UserState = {
  loading: false,
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Register failed";
      })

      // Verify
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Activation failed";
      })

      // Get Logged In User
      .addCase(getLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getLoggedInUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch user";
      })

      // Update Profile
      .addCase(updateLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateLoggedInUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(updateLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Profile update failed";
      });
  },
});

export default userSlice.reducer;

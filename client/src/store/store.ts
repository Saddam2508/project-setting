import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/users/userSlice";
import authReducer from "@/features/auth/authSlice";
import adminReducer from "@/features/admin/adminSlice";
import bannerReducer from "@/features/banner/bannerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    admin: adminReducer,
    banner: bannerReducer,
  },
});

// --- TypeScript types ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

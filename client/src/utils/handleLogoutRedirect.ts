// utils/handleLogoutRedirect.ts
"use client";

import { toast } from "react-toastify";
import api from "@/store/axiosInstance";
import { clearAuth as clearUserAuth } from "@/features/auth/authSlice";
import { clearAuth as clearAdminAuth } from "@/features/admin/adminSlice";
import type { AppDispatch } from "@/store";

type UserType = "user" | "admin";

const handleLogoutRedirect = (() => {
  let alreadyCalled = false;

  return async (type: UserType = "user", dispatch?: AppDispatch) => {
    if (alreadyCalled) return;
    alreadyCalled = true;

    const isAdmin = type === "admin";

    toast.error("⚠️ Session expired. Redirecting to login...", {
      toastId: `${type}-session-expired`,
      position: "top-center",
      autoClose: 3000,
    });

    // Delay 3s for user to see toast
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const logoutUrl = isAdmin ? "/admin/logout" : "/auth/logout";
      await api.post(logoutUrl);
    } catch (err: unknown) {
      // Safe extraction of message from unknown error
      if (err instanceof Error) {
        console.warn("❌ Logout error:", err.message);
      } else {
        console.warn("❌ Logout error:", err);
      }
    }

    // Clear Redux auth state
    if (dispatch) {
      dispatch(isAdmin ? clearAdminAuth() : clearUserAuth());
    }

    // Clear local storage & redirect
    localStorage.clear();
    window.location.href = isAdmin ? "/admin/login" : "/user-login";
  };
})();

export default handleLogoutRedirect;

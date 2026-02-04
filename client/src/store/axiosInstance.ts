"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { store } from "@/store";
import refreshTokenAndRetry from "@/features/refreshToken/refreshTokenAndRetry";
import handleLogoutRedirect from "@/utils/handleLogoutRedirect";

// Custom Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // cookie সব রিকোয়েস্টে যাবে
});

// Response interceptor
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    const isAuthRelated =
      requestUrl.includes("/logout") ||
      requestUrl.includes("/admin-login") ||
      requestUrl.includes("/register");

    if (status === 401 && !isAuthRelated && originalRequest) {
      try {
        return await refreshTokenAndRetry(originalRequest);
      } catch (refreshError) {
        await handleLogoutRedirect("admin", store.dispatch);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

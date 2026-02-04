import type { AxiosRequestConfig, AxiosResponse } from "axios";
import api from "@/store/axiosInstance";

const refreshTokenAndRetry = async <T = unknown>(
  originalRequest: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    await api.post("/admin/refresh-token"); // cookie auto পাঠাবে

    return await api<T>(originalRequest);
  } catch (error) {
    throw new Error("Session expired. Please login again.");
  }
};

export default refreshTokenAndRetry;

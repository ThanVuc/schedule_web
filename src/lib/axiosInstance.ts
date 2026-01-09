// lib/axiosInstance.ts
import axios, { AxiosInstance, AxiosHeaders } from "axios";
import { authApiUrl } from "@/api";
import { getCsrfTokenGlobal } from "./csrfToken";

// ⚡ Singleton instance
export const api: AxiosInstance = axios.create({
    baseURL: "/api", // tùy chỉnh nếu muốn
    withCredentials: true,
});

// Request interceptor: thêm CSRF token tự động
api.interceptors.request.use((config) => {
    const csrfToken = getCsrfTokenGlobal();

    // đảm bảo config.headers là AxiosHeaders
    if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
    }

    // thêm token
    config.headers.set("X-CSRF-Token", csrfToken ?? "");

    return config;
}, (error) => Promise.reject(error));


// Response interceptor: xử lý 401, refresh token, redirect
import { InternalAxiosRequestConfig } from "axios";
import { AppUrl } from "./constant";

// mở rộng config để có _retry
export interface InternalAxiosRequestConfigWithRetry<T = any> extends InternalAxiosRequestConfig<T> {
    _retry?: boolean;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // cast config về type có _retry
        const originalRequest = error.config as InternalAxiosRequestConfigWithRetry;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // get latest CSRF token from global store
                const csrfToken = getCsrfTokenGlobal();

                const refreshResponse = await axios.post(authApiUrl.refreshToken, null, {
                    withCredentials: true,
                    headers: { "X-CSRF-Token": csrfToken || "" },
                });

                if (refreshResponse.status === 200) {
                    return api(originalRequest); // retry request
                }
            } catch (_: unknown) { // eslint-disable-line @typescript-eslint/no-unused-vars
                if (
                    typeof window !== "undefined" &&
                    ![AppUrl.Login, AppUrl.Landing].includes(window.location.pathname as AppUrl)) {
                    const currentUrl = typeof window !== "undefined" ? window.location.pathname : "/";
                    window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
                }
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

import { createAxiosInstance } from "./axiosInstance";

import { store } from "../redux/store";
import { refreshAccessToken } from "../redux/slices/superAdmin/superAdminSlice";
import { handleAdminLogout, handleDriverLogout, handlePlantBlock, handlePlantLogout, handleUserBlock, handleUserLogout } from "../utils/apiUtils";

// Driver
export const axiosDriver = createAxiosInstance({
  role: "driver",
  baseURL: import.meta.env.VITE_DRIVER_API_URL,
  allowedRoutes: ["/", "/send-otp", "/resend-otp", "/verify-otp", "/reset-password", "/logout"],
  logoutHandler: handleDriverLogout,
  refreshTokenEndpoint: "/refresh-token",
});

// Wasteplant
export const axiosWasteplant = createAxiosInstance({
  role: "wasteplant",
  baseURL: import.meta.env.VITE_WASTE_PLANT_API_URL,
  allowedRoutes: ["/", "/send-otp", "/resend-otp", "/verify-otp", "/reset-password", "/logout"],
  logoutHandler: handlePlantLogout,
  refreshTokenEndpoint: "/refresh-token",
  blockHandler: handlePlantBlock
});

// User
export const axiosUser = createAxiosInstance({
  role: "user",
  baseURL: import.meta.env.VITE_API_URL,
  allowedRoutes: ["/", "/signup", "/send-otp", "/resend-otp", "/verify-otp", "/reset-password", "/logout",
      "/send-otp-signup", "/resend-otp-signup", "/verify-otp-signup", "/google-signup", "/google-login"
  ],
  logoutHandler: handleUserLogout,
  refreshTokenEndpoint: "/refresh-token",
  blockHandler: handleUserBlock
});

// Superadmin (custom refresh flow)
export const axiosSuperadmin = createAxiosInstance({
  role: "superadmin",
  baseURL: import.meta.env.VITE_SUPER_ADMIN_API_URL,
  allowedRoutes: ["/", "/signup", "/send-otp", "/resend-otp", "/verify-otp", "/reset-password", "/logout"],
  logoutHandler: handleAdminLogout,
  refreshTokenEndpoint: "/refresh-token",
});

// 🔥 Override only superadmin’s response flow to use Redux
axiosSuperadmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResult = await store.dispatch(refreshAccessToken());
        if (refreshResult.meta.requestStatus === "fulfilled") {
          const newToken = refreshResult.payload;
          localStorage.setItem("token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosSuperadmin(originalRequest);
        }
      } catch (refreshError) {
        window.location.href = "/super-admin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

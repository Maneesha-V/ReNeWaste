import axios from "axios";
import { handleDriverLogout } from "../utils/apiUtils";

const axiosDriver = axios.create({
  baseURL: import.meta.env.VITE_DRIVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosDriver.interceptors.request.use(
  async (config) => {
    console.log("config",config);
    const token = localStorage.getItem("driver_token");
    // const token = sessionStorage.getItem("driver_token");
    console.log("TOKEN IN INTERCEPTOR:", token);
    const allowedRoutes = [
      "/",
      "/send-otp",
      "/resend-otp",
      "/verify-otp",
      "/reset-password",
      "/logout",
    ];
    if (allowedRoutes.some((route) => config.url?.includes(route))) {
      return config;
    }

    if (!token) {
      // window.location.href = "/driver";
      handleDriverLogout();
      return Promise.reject(
        new Error("No token available, redirecting to login.")
      );
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
axiosDriver.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosDriver.get("/refresh-token");
        console.log("res-refresh",res);
        
        const newAccessToken = res.data.token;
        localStorage.setItem("driver_token", newAccessToken);
        // sessionStorage.setItem("driver_token",newAccessToken); 
        axiosDriver.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosDriver(originalRequest);
      } catch (refreshError) {
        // window.location.href = "/driver";
        handleDriverLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosDriver;
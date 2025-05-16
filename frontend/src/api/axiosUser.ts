import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const axiosUser = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosUser.interceptors.request.use(
  async (config) => {
    console.log("config",config);
    // const token = sessionStorage.getItem("user_token");
    const token = localStorage.getItem("token");
    // if (token) {
    //   const decoded = jwtDecode(token);
    //   console.log("Decoded Token:", decoded);
    // }
    const allowedRoutes = [
      "/",
      "/signup",
      "/send-otp-signup",
      "/resend-otp-signup",
      "/verify-otp-signup",
      "/google-signup",
      "/google-login",
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
      window.location.href = "/";
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
axiosUser.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosUser.get("/refresh-token");
        console.log("res-refresh",res);
        
        // const newAccessToken = res.data.accessToken;
        const newAccessToken = res.data.token;
        localStorage.setItem("token", newAccessToken);

        axiosUser.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosUser(originalRequest);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
 // Handle blocked user (status 403)
    if (error.response && error.response.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/blocked"; 
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosUser;
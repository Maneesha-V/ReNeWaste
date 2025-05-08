import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { handlePlantLogout } from "../utils/apiUtils";

const axiosWasteplant = axios.create({
  baseURL: import.meta.env.VITE_WASTE_PLANT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosWasteplant.interceptors.request.use(
  async (config) => {
    console.log("config",config);
    
    // const token = localStorage.getItem("wasteplant_token");
    const token = sessionStorage.getItem("wasteplant_token");
    // if (token) {
    //   const decoded = jwtDecode(token);
    //   console.log("Decoded Token:", decoded);
    // }
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
      handlePlantLogout();
      // window.location.href = "/waste-plant";
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
axiosWasteplant.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosWasteplant.get("/refresh-token");
        console.log("res-refresh",res);
        
        const newAccessToken = res.data.token;
        // localStorage.setItem("wasteplant_token", newAccessToken);
        sessionStorage.setItem("wasteplant_token",newAccessToken); 
        axiosWasteplant.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosWasteplant(originalRequest);
      } catch (refreshError) {
        // window.location.href = "/waste-plant";
        handlePlantLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosWasteplant;
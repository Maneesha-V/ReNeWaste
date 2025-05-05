import axios from "axios";
import { refreshAccessToken } from "../redux/slices/superAdmin/superAdminSlice";
import { store } from "../redux/store";

const axiosSuperadmin = axios.create({
  baseURL: import.meta.env.VITE_SUPER_ADMIN_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosSuperadmin.interceptors.request.use(
  async (config) => {
    console.log("config",config);
    
    const token = sessionStorage.getItem("admin_token");
    
    const allowedRoutes = [
      "/",
      "/signup",
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
      window.location.href = "/super-admin";
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

axiosSuperadmin.interceptors.response.use(
  (response) => response, 
  async (error) => {
    console.log("error-axios",error);
    
    const originalRequest = error.config;

    // If the error is 401 and the token hasn't been refreshed yet (avoid infinite loops)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token by dispatching the refreshAccessToken action
      try {
        const refreshResult = await store.dispatch(refreshAccessToken());
        console.log("refreshResult",refreshResult);
        if (refreshResult.meta.requestStatus === "fulfilled") {
          // If token refresh is successful, update the authorization header
          const newToken = refreshResult.payload; 
          sessionStorage.setItem("admin_token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return axiosSuperadmin(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError); // Reject the promise if token refresh fails
      }
    }

    return Promise.reject(error); // Reject the error if not 401 or other issues
  }
);

export default axiosSuperadmin;

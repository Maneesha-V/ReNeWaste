import axios, { AxiosInstance } from "axios";

type Role = "driver" | "superadmin" | "user" | "wasteplant";

interface AxiosConfig {
  role: Role;
  baseURL: string;
  allowedRoutes: string[];
  logoutHandler: () => void;
  refreshTokenEndpoint: string;
  blockHandler?: () => void;
}

export const createAxiosInstance = ({
  role,
  baseURL,
  allowedRoutes,
  logoutHandler,
  refreshTokenEndpoint,
  blockHandler
}: AxiosConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    // headers: {
    //   "Content-Type": "application/json",
    // },
    withCredentials: true,
  });

  // REQUEST INTERCEPTOR
  instance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("token");
      console.log("role",role);
      
      if (allowedRoutes.some((route) => config.url?.includes(route))) {
        return config;
      }

      if (!token) {
        logoutHandler();
        return Promise.reject(new Error("No token available, redirecting to login."));
      }

      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 🔑 Handle 401 (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await instance.get(refreshTokenEndpoint);
          const newAccessToken = res.data.token;

          localStorage.setItem("token", newAccessToken);

          instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          logoutHandler();
          return Promise.reject(refreshError);
        }
      }

      // 🔑 Handle 403 (blocked)
      if (error.response?.status === 403) {
         console.log("error", error);

      const reason = error.response.data?.reason;

      if (reason === "WASTEPLANT_BLOCKED") {
        window.location.href = "/services-unavailable";
        return Promise.reject(error);
      }
        blockHandler?.();
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

import axios from "axios";
import { LoginRequest, SignupSuperAdminRequest } from "../../types/authTypes";

const API_URL = import.meta.env.VITE_SUPER_ADMIN_API_URL;

export const loginSuperAdmin = async (superAdminData: LoginRequest) => {
  try {
    const response = await axios.post(`${API_URL}/`, superAdminData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.admin.role);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const signupSuperAdmin = async (
  superAdminData: SignupSuperAdminRequest
) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, superAdminData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.admin.role);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const logoutSuperAdmin = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("err",error)
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};

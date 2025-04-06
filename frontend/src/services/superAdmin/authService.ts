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
export const sendOtpService = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    console.log("response", response);
    return response.data;
  } catch (error: any) {
    console.log("err", error);

    console.error(
      "Error sending OTP:",
      error.response?.data?.error || error.message
    );
    throw (
      error.response?.data?.error || "Something went wrong while sending OTP"
    );
  }
};
export const resendOtpService = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, { email });
    console.log("respp", response);

    return response.data;
  } catch (error: any) {
    console.error("Error resending OTP:", error);
    throw (
      error.response?.data?.error || "Something went wrong while resending OTP"
    );
  }
};
export const verifyOtpService = async (email: string, otp: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return data;
  } catch (error: any) {
    console.error(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    throw {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to verify OTP",
    };
  }
};
export const resetPasswordService = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in reset password:",
      error.response?.data?.error || error.message
    );
    throw {
      message: error.response?.data?.error || "Failed to reset password",
    };
  }
};


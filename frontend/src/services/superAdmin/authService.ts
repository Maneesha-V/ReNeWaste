import { LoginRequest, SignupSuperAdminRequest } from "../../types/authTypes";
import axiosSuperadmin from "../../api/axiosSuperadmin";

export const getRefreshAccessToken = async () => {
  try {
    const response = await axiosSuperadmin.get(`/refresh-token`);

    console.log("ref-repsone", response);

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.error ||
      "Refresh token fetching failed. Please try again."
    );
  }
};
export const loginSuperAdmin = async (superAdminData: LoginRequest) => {
  try {
    const response = await axiosSuperadmin.post("/", superAdminData);
    console.log("res", response);

    if (response.data) {
      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_role", response.data.role);
      localStorage.setItem("admin_id", response.data.adminId);
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
    const response = await axiosSuperadmin.post(`/signup`, superAdminData);
    if (response.data) {
      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_role", response.data.role);
      localStorage.setItem("admin_id", response.data.adminId);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const logoutSuperAdmin = async () => {
  try {
    const response = await axiosSuperadmin.post(`/logout`, {});
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_id");
    return response.data;
  } catch (error: any) {
    console.error("err", error);
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const sendOtpService = async (email: string) => {
  try {
    const response = await axiosSuperadmin.post(`/send-otp`, { email });
    console.log("response", response);
    return response.data;
  } catch (error: any) {
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
    const response = await axiosSuperadmin.post(`/resend-otp`, { email });
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
    const { data } = await axiosSuperadmin.post(`/verify-otp`, { email, otp });
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
    const response = await axiosSuperadmin.post(`/reset-password`, {
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

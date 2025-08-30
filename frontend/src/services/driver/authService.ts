import { axiosDriver } from "../../config/axiosClients";
import { LoginRequest } from "../../types/authTypes";

export const loginDriver = async (driverData: LoginRequest) => {
  try {
    const response = await axiosDriver.post(`/`, driverData);
    console.log("res",response);
    
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("id", response.data.driverId);
      localStorage.setItem("driver_category", response.data.category);
    }
    console.log("res",response);

    return response.data;
  } catch (error: any) {
    console.error("err", error);
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const logoutDriver = async () => {
  try {
    const response = await axiosDriver.post(
      `/logout`,
      {}
    );
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("driver_category");
    return response.data;
  } catch (error: any) {
    console.error("err",error)
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const sendOtpService = async (email: string) => {
  try {
    const response = await axiosDriver.post(`/send-otp`, { email });
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
    const response = await axiosDriver.post(`/resend-otp`, { email });
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
    const { data } = await axiosDriver.post(`/verify-otp`, { email, otp });
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
    const response = await axiosDriver.post(`/reset-password`, {
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


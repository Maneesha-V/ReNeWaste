import { LoginRequest } from "../../types/authTypes";
import axiosWasteplant from "../../api/axiosWasteplant";

export const loginWastePlant = async (wastePlantData: LoginRequest) => {
  // try {
    const response = await axiosWasteplant.post(`/`, wastePlantData);
    if (response.data) {
      localStorage.setItem("wasteplant_token", response.data.token);
      localStorage.setItem("wasteplant_role", response.data.role);
      localStorage.setItem("wasteplant_id", response.data.plantId);
      localStorage.setItem("wasteplant_status", response.data.status);
    }
    console.log(response);

    return response.data;
  // } catch (error: any) {
  //   console.error("err", error);
  //   throw error.response?.data?.error || "Login failed. Please try again.";
  // }
};

export const logoutWastePlant = async () => {
  try {
    const response = await axiosWasteplant.post(
      `/logout`,
      {}
    );
    localStorage.removeItem("wasteplant_token"); 
    localStorage.removeItem("wasteplant_role"); 
    localStorage.removeItem("wasteplant_id");
    return response.data;
  } catch (error: any) {
    console.error("err", error);
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};
export const sendOtpService = async (email: string) => {
  try {
    const response = await axiosWasteplant.post(`/send-otp`, { email });
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
    const response = await axiosWasteplant.post(`/resend-otp`, { email });
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
    const { data } = await axiosWasteplant.post(`/verify-otp`, { email, otp });
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
    const response = await axiosWasteplant.post(`/reset-password`, {
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

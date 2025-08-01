import axiosUser from "../../api/axiosUser";
import { toast } from "react-toastify";
import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { GoogleLoginReq, LoginRequest, SignupRequest } from "../../types/user/userTypes";

export const signupUser = async (userData: SignupRequest) => {
  try {
    const response = await axiosUser.post(`/signup`, userData);
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.log("err", error);
    if (error.response && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    throw error;
  }
};
export const loginUser = async (userData: LoginRequest) => {
  const response = await axiosUser.post(`/`, userData);
  console.log("logRes", response);
  if (response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("user_id", response.data.userId);
  }
  return response.data;
};
export const logoutUser = async () => {
  const response = await axiosUser.post(`/logout`, {});
  console.log("Logout API response:", response.data);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user_id");
  return response.data;
};
export const sendOtpSignupService = async (email: string) => {
  try {
    const response = await axiosUser.post(`/send-otp-signup`, { email });
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
export const resendOtpSignupService = async (email: string) => {
  try {
    const response = await axiosUser.post(`/resend-otp-signup`, { email });
    console.log("respp", response);

    return response.data;
  } catch (error: any) {
    console.error("Error resending OTP:", error);
    throw (
      error.response?.data?.error || "Something went wrong while resending OTP"
    );
  }
};
export const verifyOtpSignupService = async (email: string, otp: string) => {
  try {
    const { data } = await axiosUser.post(`/verify-otp-signup`, { email, otp });
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
export const sendOtpService = async (email: string) => {
    const response = await axiosUser.post(`/send-otp`, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpService = async (email: string) => {
    const response = await axiosUser.post(`/resend-otp`, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpService = async (email: string, otp: string) => {
    const { data } = await axiosUser.post(`/verify-otp`, { email, otp });
    return data;
};
export const resetPasswordService = async (email: string, password: string) => {
    const response = await axiosUser.post(`/reset-password`, {
      email,
      password,
    });
    return response.data;
};
export const googleSignUpService = async (
  auth: Auth,
  googleProvider: GoogleAuthProvider
) => {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;
    const response = await axiosUser.post(`/google-signup`, {
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
    });
    console.log("resppp", response);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
    }
    return response.data;
};
export const googleSignInService = async (userData: GoogleLoginReq) => {
  // try {
    const response = await axiosUser.post(`/google-login`, userData);
    console.log("logRes", response);

    if (!response.data || !response.data.success) {
      throw new Error("Invalid response from server.");
    }

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);

    return response.data;
  // } catch (error: any) {
  //   console.error("Google login error:", error);
  //   throw (
  //     error.response?.data?.message || "Google login failed. Please try again."
  //   );
  // }
};

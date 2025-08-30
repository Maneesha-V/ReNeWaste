import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { GoogleLoginReq, LoginRequest, SignupRequest } from "../../types/user/userTypes";
import { axiosUser } from "../../config/axiosClients";

export const signupUser = async (userData: SignupRequest) => {
    const response = await axiosUser.post(`/signup`, userData);
    console.log("res", response);
    return response.data;
};
export const loginUser = async (userData: LoginRequest) => {
  const response = await axiosUser.post(`/`, userData);
  console.log("logRes", response);
  if (response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("id", response.data.userId);
  }
  return response.data;
};
export const logoutUser = async () => {
  const response = await axiosUser.post(`/logout`, {});
  console.log("Logout API response:", response.data);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
  return response.data;
};
export const sendOtpSignupService = async (email: string) => {
    const response = await axiosUser.post(`/send-otp-signup`, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpSignupService = async (email: string) => {

    const response = await axiosUser.post(`/resend-otp-signup`, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpSignupService = async (email: string, otp: string) => {
    const { data } = await axiosUser.post(`/verify-otp-signup`, { email, otp });
    return data;
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
    const response = await axiosUser.post(`/google-login`, userData);
    console.log("logRes", response);

    if (!response.data || !response.data.success) {
      throw new Error("Invalid response from server.");
    }

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);

    return response.data;

};

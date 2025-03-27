import axios from "axios";
import { toast } from "react-toastify";
import { SignupRequest, LoginRequest } from "../../types/authTypes"

const API_URL = import.meta.env.VITE_API_URL; 

export const signupUser = async (userData: SignupRequest) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log("res",response);
    return response.data;
  } catch(error: any) {
      console.log("err",error);   
      if(error.response && error.response.data.error){
        toast.error(error.response.data.error)
      }else{
        toast.error("An unexpected error occurred. Please try again.");
      }
      throw error;
  }
};
export const loginUser = async (userData: LoginRequest) => {
  try {
    const response = await axios.post(`${API_URL}/`,userData);
    console.log("logRes",response);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role); 
    }  
    return response.data;
  } catch(error: any) {
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
}
export const logoutUser = async () => {
  return await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

export const sendOtpService = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, {email});
    return response.data;     
  } catch (error: any) {
    console.error("Error sending OTP:", error.response?.data?.error || error.message);
    throw error.response?.data?.error || "Something went wrong while sending OTP";
  }
}
export const verifyOtpService = async (email: string,otp: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return data;
  } catch (error: any) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw { message: error.response?.data?.error || error.response?.data?.message || "Failed to verify OTP" };
  }
}
export const resetPasswordService = async (email: string,password: string) => {
  try{
    const response = await axios.post(`${API_URL}/reset-password`, { email,password });
    return response.data;
  } catch (error: any){
    console.error("Error in reset password:", error.response?.data?.error || error.message);
    throw {message: error.response?.data?.error || "Failed to reset password"};
  }
}
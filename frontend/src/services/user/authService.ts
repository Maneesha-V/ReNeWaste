import axios from "axios";
import { toast } from "react-toastify";
import { SignupRequest, LoginRequest, GoogleLoginReq } from "../../types/authTypes"
import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
    console.log("response",response);
    return response.data;     
  } catch (error: any) {
    console.log("err",error);
    
    console.error("Error sending OTP:", error.response?.data?.error || error.message);
    throw error.response?.data?.error || "Something went wrong while sending OTP";
  }
}
export const resendOtpService = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, {email});
    console.log("respp",response);
    
    return response.data;     
  } catch (error: any) {
    console.error("Error resending OTP:", error);
    throw error.response?.data?.error || "Something went wrong while resending OTP";
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
export const googleSignUpService = async (auth: Auth, googleProvider: GoogleAuthProvider) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;
    const response = await axios.post(`${API_URL}/google-signup`,
      {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      }
    )
    console.log("resppp",response);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role); 
    }  
    return response.data;
  } catch(error: any){
    console.error("Error in Google Sign-Up:", error.response?.data?.error || error.message);
    throw {message: error.response?.data?.error || "Failed to Google Sign-Up"};
  }
}
export const googleSignInService = async (userData: GoogleLoginReq) => {
  try {
    const response = await axios.post(`${API_URL}/google-login`, userData);
    console.log("logRes", response);

    if (!response.data || !response.data.user || !response.data.token) {
      throw new Error("Invalid response from server.");
    }

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.user.role);

    return response.data;
  } catch (error: any) {
    console.error("Google login error:", error);
    throw error.response?.data?.message || "Google login failed. Please try again.";
  }
};

// export const googleSignInService = async (userData: GoogleLoginReq) => {
//   try {
//     const response = await axios.post(`${API_URL}/google-login`,userData);
//     console.log("logRes",response);
//     if (response.data && response.data.user && response.data.token) {
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("role", response.data.user.role); 
//       return response.data;
//     } else {
//       throw new Error("Invalid login response. Please try again.");
//     }
//   } catch(error: any) {
//     console.error("Google login error:", error);
//     throw error.response?.data?.error || "Google login failed. Please try again.";
//   }
// }
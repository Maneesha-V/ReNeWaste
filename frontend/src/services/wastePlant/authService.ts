import { axiosWasteplant } from "../../config/axiosClients";
import { LoginRequest } from "../../types/user/userTypes";

export const loginWastePlant = async (wastePlantData: LoginRequest) => {
    const response = await axiosWasteplant.post(`/`, wastePlantData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("id", response.data.plantId);
      localStorage.setItem("wasteplant_status", response.data.status);
    }
    console.log(response);

    return response.data;
};

export const logoutWastePlant = async () => {
    const response = await axiosWasteplant.post(
      `/logout`,
      {}
    );
    localStorage.removeItem("token"); 
    localStorage.removeItem("role"); 
    localStorage.removeItem("id");
    localStorage.removeItem("wasteplant_status");
    return response.data;
};
export const sendOtpService = async (email: string) => {
    const response = await axiosWasteplant.post(`/send-otp`, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpService = async (email: string) => {
    const response = await axiosWasteplant.post(`/resend-otp`, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpService = async (email: string, otp: string) => {
    const { data } = await axiosWasteplant.post(`/verify-otp`, { email, otp });
    return data;
};
export const resetPasswordService = async (email: string, password: string) => {
    const response = await axiosWasteplant.post(`/reset-password`, {
      email,
      password,
    });
    return response.data;
};

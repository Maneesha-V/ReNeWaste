import { axiosDriver } from "../../config/axiosClients";
import { LoginRequest } from "../../types/driver/driverTypes";


export const loginDriver = async (driverData: LoginRequest) => {
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
};
export const logoutDriver = async () => {
    const response = await axiosDriver.post(
      `/logout`,
      {}
    );
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("driver_category");
    return response.data;
};
export const sendOtpService = async (email: string) => {
    const response = await axiosDriver.post(`/send-otp`, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpService = async (email: string) => {
    const response = await axiosDriver.post(`/resend-otp`, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpService = async (email: string, otp: string) => {
    const { data } = await axiosDriver.post(`/verify-otp`, { email, otp });
    return data;
};
export const resetPasswordService = async (email: string, password: string) => {
    const response = await axiosDriver.post(`/reset-password`, {
      email,
      password,
    });
    return response.data;
};


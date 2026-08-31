import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { LoginRequest } from "../../types/driver/driverTypes";


export const loginDriver = async (driverData: LoginRequest) => {
    const response = await axiosDriver.post(API_ROUTES.DRIVER.LOGIN, driverData);
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
      API_ROUTES.DRIVER.LOGOUT,
      {}
    );
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("driver_category");
    return response.data;
};
export const sendOtpService = async (email: string) => {
    const response = await axiosDriver.post(API_ROUTES.DRIVER.SEND_OTP, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpService = async (email: string) => {
    const response = await axiosDriver.post(API_ROUTES.DRIVER.RESEND_OTP, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpService = async (email: string, otp: string) => {
    const { data } = await axiosDriver.post(API_ROUTES.DRIVER.VERIFY_OTP, { email, otp });
    return data;
};
export const resetPasswordService = async (email: string, password: string) => {
    const response = await axiosDriver.post(API_ROUTES.DRIVER.RESET_PASSWORD, {
      email,
      password,
    });
    return response.data;
};


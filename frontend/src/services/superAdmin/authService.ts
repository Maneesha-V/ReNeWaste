import { axiosSuperadmin } from "../../config/axiosClients";
import { LoginRequest, SignUpReq } from "../../types/superadmin/superAdminTypes";

export const getRefreshAccessToken = async () => {
    const response = await axiosSuperadmin.get(`/refresh-token`);

    console.log("ref-repsone", response);

    return response.data;
};
export const loginSuperAdmin = async (superAdminData: LoginRequest) => {
    const response = await axiosSuperadmin.post("/", superAdminData);
    console.log("res", response);

    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("id", response.data.adminId);
    }
    return response.data;
};
export const signupSuperAdmin = async (
  superAdminData: SignUpReq
) => {
    const response = await axiosSuperadmin.post(`/signup`, superAdminData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("id", response.data.adminId);
    }
    return response.data;
};
export const logoutSuperAdmin = async () => {
    const response = await axiosSuperadmin.post(`/logout`, {});
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    return response.data;
};
export const sendOtpService = async (email: string) => {
    const response = await axiosSuperadmin.post(`/send-otp`, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpService = async (email: string) => {
    const response = await axiosSuperadmin.post(`/resend-otp`, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpService = async (email: string, otp: string) => {
    const { data } = await axiosSuperadmin.post(`/verify-otp`, { email, otp });
    return data;
};
export const resetPasswordService = async (email: string, password: string) => {
    const response = await axiosSuperadmin.post(`/reset-password`, {
      email,
      password,
    });
    return response.data;
};

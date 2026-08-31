import { axiosSuperadmin } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { LoginRequest, SignUpReq } from "../../types/superadmin/superAdminTypes";

export const loginSuperAdmin = async (superAdminData: LoginRequest) => {
    const response = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.LOGIN, superAdminData);
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
    const response = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.SIGNUP, superAdminData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("id", response.data.adminId);
    }
    return response.data;
};
export const logoutSuperAdmin = async () => {
    const response = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.LOGOUT, {});
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    return response.data;
};
export const sendOtpService = async (email: string) => {
    const response = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.SEND_OTP, { email });
    console.log("response", response);
    return response.data;
};
export const resendOtpService = async (email: string) => {
    const response = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.RESEND_OTP, { email });
    console.log("respp", response);

    return response.data;
};
export const verifyOtpService = async (email: string, otp: string) => {
    const { data } = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.VERIFY_OTP, { email, otp });
    return data;
};
export const resetPasswordService = async (email: string, password: string) => {
    const response = await axiosSuperadmin.post(API_ROUTES.SUPER_ADMIN.RESET_PASSWORD, {
      email,
      password,
    });
    return response.data;
};

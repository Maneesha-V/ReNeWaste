import { SuperAdminLoginRequest, SuperAdminLoginResponse, SuperAdminSignupRequest, SuperAdminSignupResponse } from "../../../types/superAdmin/authTypes";

export interface ISuperAdminAuthService {
    adminLoginService(data: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse>;
    adminSignupService(data: SuperAdminSignupRequest): Promise<SuperAdminSignupResponse>;
    
}
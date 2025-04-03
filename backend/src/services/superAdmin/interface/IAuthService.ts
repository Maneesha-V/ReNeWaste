import { SuperAdminLoginRequest, SuperAdminLoginResponse } from "../../../types/superAdmin/authTypes";

export interface ISuperAdminAuthService {
    adminLoginService(data: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse>;
}
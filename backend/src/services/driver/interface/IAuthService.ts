import { LoginRequest, LoginResponse } from "../../../types/driver/authTypes";

export interface IAuthService {
    loginDriver(loginData: LoginRequest): Promise<LoginResponse>;
}
import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";

export interface SuperAdminLoginRequest {
    email: string;
    password: string;
  }
  export interface SuperAdminLoginResponse {
    admin: ISuperAdminDocument;
    token: string;
  }
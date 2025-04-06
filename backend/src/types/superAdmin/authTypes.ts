import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";

export interface SuperAdminLoginRequest {
    email: string;
    password: string;
  }
  export interface SuperAdminLoginResponse {
    admin: ISuperAdminDocument;
    token: string;
  }
  export interface SuperAdminSignupRequest {
    username : string;
    email: string;
    password: string;
  }
  export interface SuperAdminSignupResponse {
    admin: ISuperAdminDocument;
    token: string;
  }
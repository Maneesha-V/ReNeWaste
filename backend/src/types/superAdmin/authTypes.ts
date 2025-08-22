import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";

export type SuperAdminLoginRequest = {
    email: string;
    password: string;
  }
  export type SuperAdminLoginResponse = {
    admin: ISuperAdminDocument;
    token: string;
  }
  // export type SuperAdminSignupRequest = {
  //   username : string;
  //   email: string;
  //   password: string;
  // }
  // export type SuperAdminSignupResponse = {
  //   admin: SuperAdminDTO;
  //   token: string;
  // }
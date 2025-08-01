import { Auth, GoogleAuthProvider } from "firebase/auth";

export type SendOtpError = {
   message: string;
}
export type VerifyOtpReq = {
  email: string; 
  otp: string
}
export type ResetPasswordReq = {
  email: string; 
  password: string
}
export type GoogleSignUpArgs = {
  auth: Auth;
  googleProvider: GoogleAuthProvider;
}; 
export type GoogleSignUpResp = {
  message: string;
  role: string;
  token: string;
}

export type PaginationPayload = {
  page: number;
  limit: number;
  search: string;
}
export interface PaginationSearchProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}

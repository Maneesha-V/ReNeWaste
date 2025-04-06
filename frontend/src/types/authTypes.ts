export interface SignupResponse {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    token: string;
  }
  
  export interface LoginResponse {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    token: string;
  }
  
  export interface SignupRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
  }
  export interface SignupSuperAdminRequest {
    username: string;
    email: string;
    password: string;
  }
  export interface LoginRequest {
    email: string;
    password: string;
  }
  export interface GoogleLoginReq {
    email: string;
    googleId: string;
    token: string;
  }
  export type FormErrors = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    agreeToTerms?: string;
  };
  
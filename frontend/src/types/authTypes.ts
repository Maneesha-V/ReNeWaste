  export type SignupRequest = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;  
    agreeToTerms: boolean;
  }
  export type SignupSuperAdminRequest = {
    username: string;
    email: string;
    password: string;
  }
  export type LoginRequest = {
    email: string;
    password: string;
  }
  export type GoogleLoginReq = {
    email: string;
    googleId: string;
  }
  export type FormErrors = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;  
    agreeToTerms?: string;
  };
  export type SignupResponse = {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    token: string;
  }
  
  export type LoginResponse = {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    token: string;
  }
  
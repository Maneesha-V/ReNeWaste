export type LoginRequest = {
  email: string;
  password: string;
};
export type LoginResponse = {
  message: string;
  role: string;
  success: boolean;
  token: string;
  userId: string;
};
export type GoogleLoginReq = {
  email: string;
  googleId: string;
};
export type GoogleLoginResp = {
  role: string;
  token: string;
  message: string;
  success: boolean;
};
export type SignupRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};
export type Address = {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  taluk: string;
  location: string;
  state: string;
  pincode: string;
  district: string;
  latitude?: number;
  longitude?: number;
};
export type UserResp = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  agreeToTerms: boolean;
  role: string;
  phone?: string;
  googleId: string | null;
  addresses: Address[];
  wasteplantId?: string;
  isBlocked: boolean;
};

export type GetResidResp = {
  user: UserResp;
  message: string;
}
export type GetCommResp = {
  user: UserResp;
  message: string;
}
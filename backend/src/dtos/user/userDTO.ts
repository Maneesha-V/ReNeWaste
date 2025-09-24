import {
  IUser,
  IUserDocument,
} from "../../models/user/interfaces/userInterface";
import { BaseDTO } from "../base/BaseDTO";

export type Role = "user" | "driver" | "superadmin" | "wasteplant";
export interface UserDTO extends BaseDTO {
  firstName: string;
  lastName: string;
  email: string;
  agreeToTerms: boolean;
  role: Role;
  phone?: string;
  googleId: string | null;
  addresses: AddressDTO[];
  wasteplantId?: string | null;
  isBlocked: boolean;
}

export interface AddressDTO {
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
}
export interface UserLoginDTO {
  _id: string;
  role: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserLoginDTO;
  token: string;
}
export type SignupResponse = {
  user: UserLoginDTO;
  token: string;
};
type WasteType = "Residential" | "Commercial";

export interface UpdatedResidentialData {
  phone: string;
  pickupDate: string;
  pickupTime: string;
  wasteType: WasteType;
  firstName: string;
  lastName: string;
  email: string;
  selectedAddressId: string;
}
export interface GoogleSignUpReq {
  email: string;
  displayName: string;
  uid: string;
}
export interface GoogleSignUpResp {
  role: string;
  token: string;
}
export type GoogleLoginReq = {
  email: string;
  googleId: string;
};
export type GoogleLoginResp = {
  role: string;
  token: string;
  userId: string;
};

export type UpdatedCommercialDataDTO = {
  phone: string;
  pickupDate: Date;
  pickupTime: string;
  wasteType: WasteType;
  businessName: string;
  frequency: string;
  service: string;
  firstName: string;
  lastName: string;
  email: string;
  selectedAddressId?: string;
};

export type UserProfileRespDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wasteplantId: string;
  // addresses: ProfileAddress[];
  addresses: AddressDTO[];
};

export type ProfileAddress = {
  addressLine1: string;
  addressLine2: string;
  taluk: string;
  location: string;
  pincode: string;
  district: string;
  state: string;
};
export type PaginatedResult = {
  users: UserDTO[];
  total: number;
};
export type PaginatedUsersResult = {
  users: IUserDocument[];
  total: number;
};

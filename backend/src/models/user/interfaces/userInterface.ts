import mongoose, { Document, Types } from "mongoose";
import { IAddressDocument } from "./addressInterface";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  agreeToTerms: boolean;
  role: "user" | "driver" | "superadmin" | "wasteplant";
  phone?: string;
  googleId: string | null;
  addresses: Types.DocumentArray<IAddressDocument>;
  wasteplantId?: mongoose.Types.ObjectId;
  isBlocked: boolean;
  wallet?: mongoose.Types.ObjectId;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export type PaginatedUsersResult = {
  users: IUserDocument[];
  total: number;
};

export interface Address {
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
export type Role = "user" | "driver" | "superadmin" | "wasteplant";

export interface UpdateUserProfileData {
  _id: string | Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  agreeToTerms: boolean;
  role: Role;
  phone?: string;
  googleId: string | null;
  addresses: Address[];
  wasteplantId?: string | null;
  isBlocked: boolean;
}
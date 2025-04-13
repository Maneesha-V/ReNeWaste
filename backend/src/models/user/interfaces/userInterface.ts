import  mongoose, { Document, Types } from "mongoose";
import { IAddress } from "./addressInterface";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    agreeToTerms: boolean;
    role: "user" | "driver" | "superadmin" | "wasteplant";
    phone?: string;
    googleId: string | null;
    addresses: IAddress[];
    wasteplantId?: mongoose.Types.ObjectId;
  }

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}
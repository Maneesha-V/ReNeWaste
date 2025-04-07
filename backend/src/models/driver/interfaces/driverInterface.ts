import { Document, Types } from "mongoose";

export interface IDriver {
  name: string;
  email: string;
  licenseNumber: string;
  contact: string;
  experience: number;
  status: "Active" | "Inactive" | "Suspended";
  password: string;
  licenseFront: string;
  licenseBack: string;
  role: "driver" | "user" | "superadmin" | "wasteplant";
  createdAt: Date;
  updatedAt: Date;
}
export interface IDriverDocument extends IDriver, Document {
    _id: Types.ObjectId;
  }
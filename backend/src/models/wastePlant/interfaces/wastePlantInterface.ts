import { Document, Types } from "mongoose";

export interface IWastePlant {
  plantName: string;
  ownerName: string;
  location: string;
  district: string;
  taluk: string;
  pincode: string;
  state: string;
  contactInfo: string;
  contactNo: string;
  email: string;
  licenseNumber: string;
  capacity: number;
  services: string[];
  status: "Pending" | "Active" | "Inactive" | "Rejected";
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
  subscriptionPlan?: string;
  password: string;
  role: "user" | "driver" | "superadmin" | "wasteplant";
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface IWastePlantDocument extends IWastePlant, Document {
  _id: Types.ObjectId;
}

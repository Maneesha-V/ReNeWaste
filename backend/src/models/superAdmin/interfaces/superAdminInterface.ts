import  { Document, Types } from "mongoose";

export interface ISuperAdmin {
    username: string; 
    email: string;
    password: string;
    role?: "user" | "driver" | "superadmin" | "wasteplant";
    createdAt?: Date;
  }
  
export interface ISuperAdminDocument extends ISuperAdmin, Document {
  _id: Types.ObjectId;
}
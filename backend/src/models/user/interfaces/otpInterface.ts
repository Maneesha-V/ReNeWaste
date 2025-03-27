import  { Document, Types } from "mongoose";

export interface IOtp {
    email: string;
    otp: string;
    createdAt?: Date;
  }
  
export interface IOtpDocument extends IOtp, Document {
  _id: Types.ObjectId;
}
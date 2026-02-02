import { Types } from "mongoose";
import { Request } from "express";

export interface BaseDTO {
  _id: string | Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}
export type PopulatedRef = {
  _id: Types.ObjectId;
  name: string;
};
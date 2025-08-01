import { Types } from "mongoose";

export interface BaseDTO {
  _id?: string | Types.ObjectId;
}
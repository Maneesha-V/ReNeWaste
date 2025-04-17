import mongoose, { Document, Types } from "mongoose";

export interface ITruck {
  name: string;
  vehicleNumber: string;
  capacity: number;
  assignedDriver?: mongoose.Types.ObjectId;
  wasteplantId?: mongoose.Types.ObjectId;
  status: "Active" | "Inactive" | "Maintenance";
  createdAt: Date;
  updatedAt: Date;
}
export interface ITruckDocument extends ITruck, Document {
    _id: Types.ObjectId;
  }
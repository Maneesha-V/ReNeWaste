import mongoose, { Document, Types } from "mongoose";

export interface ITruck {
  name: string;
  vehicleNumber: string;
  capacity: number;
  assignedDriver?: mongoose.Types.ObjectId | null;
  wasteplantId?: mongoose.Types.ObjectId;
  status: "Active" | "Inactive" | "Maintenance";
  isReturned?: boolean;
  tareWeight: number;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface ITruckDocument extends ITruck, Document {
  _id: Types.ObjectId;
}

export type PaginatedTrucksResult = {
  trucks: ITruckDocument[];
  total: number;
};

export type ReturnFetchAllTrucksByPlantId = {
  active: number;
  inactive: number;
  maintenance: number;
};
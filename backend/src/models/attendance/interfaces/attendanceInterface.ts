import mongoose, { Document, Types } from "mongoose";

export interface IAttendance {
   driverId?: mongoose.Types.ObjectId;
   wasteplantId?: mongoose.Types.ObjectId;
   assignedTruckId?: mongoose.Types.ObjectId;
   date: Date;
   status: string;
   workType: string;
   totalPickups: number;
   reward: number;
   earning: number;
   createdAt?: Date;
   updatedAt?: Date;
}
export interface IAttendanceDocument extends IAttendance, Document {
  _id: Types.ObjectId;
}
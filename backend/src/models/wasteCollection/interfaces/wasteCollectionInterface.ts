import { Document, Types } from "mongoose";

export interface IWasteCollection extends Document {
  driverId: Types.ObjectId;
  truckId: Types.ObjectId;
  wasteplantId: Types.ObjectId;
  measuredWeight: number;
  collectedWeight: number;
  wasteType: "Residential" | "Commercial";
  returnedAt: Date;
}
export interface IWasteCollectionDocument extends IWasteCollection, Document {
  _id: Types.ObjectId;
}
export type InputWasteMeasurementRepo = {
  wasteplantId: string;
  weight: number;
  notificationId: string;
};
export type ReturnTotalWasteAmount = {
  totalResidWaste: number;
  totalCommWaste: number;
};
export type ReturnWasteMeasurementRepo = {
  notificationId: string;
};
export type FilterReportRepo = {
  from: string;
  to: string;
  plantId: string;
};
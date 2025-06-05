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
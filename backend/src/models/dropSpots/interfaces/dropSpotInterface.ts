import mongoose, { Types, Document } from "mongoose";

export interface IDropSpot {
  dropSpotName: string;
  addressLine: string;
  location: string;
  pincode: string;
  state: string;
  district: string;
  wasteplantId: mongoose.Types.ObjectId;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDeleted?: boolean;
}

export interface IDropSpotDocument extends IDropSpot, Document {
  _id: Types.ObjectId;
}

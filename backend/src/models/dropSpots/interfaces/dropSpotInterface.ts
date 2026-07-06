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

export type PaginatedDropSpotsRepoRes = {
  dropspots: IDropSpotDocument[];
  total: number;
};

export type UpdateDataDropSpotReq = {
  dropSpotName: string;
  addressLine: string;
  location: string;
  pincode: string;
  district: string;
  state: string;
};
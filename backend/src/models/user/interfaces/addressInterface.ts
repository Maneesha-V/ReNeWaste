import { Document, Types } from "mongoose";

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  taluk: string;
  location: string;
  state: string;
  pincode: string;
  district: string;
  latitude?: number;
  longitude?: number;
}

export interface IAddressDocument extends IAddress, Document {
  _id: Types.ObjectId;
}

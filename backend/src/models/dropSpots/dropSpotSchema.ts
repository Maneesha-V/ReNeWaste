import mongoose, { Schema } from "mongoose";
import { IDropSpotDocument } from "./interfaces/dropSpotInterface";

export const DropSpotSchema: Schema<IDropSpotDocument> = new Schema(
  {
    dropSpotName: { type: String, required: true },
    addressLine: { type: String, required: true },
    location: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true, default: "Kerala" },
    district: { type: String, required: true, default: "Malappuram" },
    wasteplantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastePlant",
      default: null,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  {
    timestamps: true,
  }
);

import mongoose, { Schema } from "mongoose";
import { IWasteCollectionDocument } from "./interfaces/wasteCollectionInterface";

export const wasteCollectionSchema: Schema<IWasteCollectionDocument> =
  new Schema(
    {
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
      },
      truckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck",
        required: true,
      },
      wasteplantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WastePlant",
        required: true,
      },
      measuredWeight: {
        type: Number,
        required: true,
      },
      collectedWeight: {
        type: Number,
        required: true,
      },
      wasteType: {
        type: String,
        enum: ["Residential", "Commercial"],
        required: true,
      },
      returnedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    },
  );

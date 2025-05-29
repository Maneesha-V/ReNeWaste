import mongoose, { Schema } from "mongoose";
import { ITruckDocument } from "./interfaces/truckInterface";

export const truckSchema: Schema<ITruckDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
      index: true,
    },
    wasteplantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastePlant",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
      default: "Active",
    },
    isReturned: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);



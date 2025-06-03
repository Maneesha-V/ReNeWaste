import mongoose, { Schema } from "mongoose";
import { IDriverDocument } from "./interfaces/driverInterface";

export const driverSchema: Schema<IDriverDocument> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  experience: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },
  licenseFront: { type: String, required: true },
  licenseBack: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["driver", "user", "superadmin", "wasteplant"],
    default: "driver",
    required: true
  },
  wasteplantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WastePlant",
    default: null,
  },
  assignedTruckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Truck",
    default: null,
  },
  assignedZone: { type: String },
  hasRequestedTruck: {
    type: Boolean,
    default: false, 
  },
  category: {
    type: String,
    enum: ["Residential","Commercial","Pending"],
    default: "Pending",
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

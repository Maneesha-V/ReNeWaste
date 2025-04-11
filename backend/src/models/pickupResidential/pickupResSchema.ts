import  mongoose, { Schema } from "mongoose";
import { IPickupRequestResidentialDocument } from "./interfaces/pickupResInterface";
export const pickupRequestResidentialSchema: Schema<IPickupRequestResidentialDocument> = new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
      },
      wasteplantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WastePlant",
        default: null,
      },
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address", // or 'User.addresses', depending on how you model addresses
        required: true,
      },
      wasteType: {
        type: String,
        required: true,
      },
      originalPickupDate: {
        type: Date,
        required: true,
      },
      rescheduledPickupDate: {
        type: Date,
        default: null,
      },
      pickupTime: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Scheduled", "Completed", "Cancelled"],
        default: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );
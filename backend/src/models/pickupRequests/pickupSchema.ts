import  mongoose, { Schema } from "mongoose";
import { IPickupRequestDocument } from "./interfaces/pickupInterface";
export const pickupRequestSchema: Schema<IPickupRequestDocument> = new Schema(
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
        ref: "Address", 
        required: true,
      },
      wasteType: {
        type: String,
        enum: ['Residential', 'Commercial'],
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
      pickupId: {
        type: String,
        required: true,
        unique: true,
      },
      businessName: {
        type: String,
        required: function () {
          return this.wasteType === 'Commercial';
        },
      },
      service: {
        type: String,
        required: function () {
          return this.wasteType === 'Commercial';
        },
      },
      frequency: {
        type: String,
        required: function () {
          return this.wasteType === 'Commercial';
        },
      },
      status: {
        type: String,
        enum: ["Pending", "Scheduled", "Completed", "Cancelled","Scheduled"],
        default: "Pending",
      },
      eta: {
        text: { type: String, default: null },
        value: { type: Number, default: null },
      },
      trackingStatus: {
        type: String,
        enum: ["Assigned", "InTransit", "Near", "Arrived", "Completed"],
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );
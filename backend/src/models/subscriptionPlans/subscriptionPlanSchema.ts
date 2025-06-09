import mongoose, { Schema } from "mongoose";
import { ISubscriptionPlanDocument } from "./interfaces/subsptnPlanInterface";

export const SubscriptionPlanSchema = new Schema<ISubscriptionPlanDocument>(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Yearly"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    driverLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    userLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    truckLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    trialDays: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);


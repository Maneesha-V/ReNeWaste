import mongoose, { Schema, Document, Types } from "mongoose";
import { ISubscriptionPaymentDocument } from "./interface/subsptnPaymentInterface";

export const SubscriptionPaymentSchema: Schema<ISubscriptionPaymentDocument> = new Schema(
  {
    wasteplantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastePlant",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    method: {
      type: String,
      default: "Razorpay",
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    refundRequested: {
      type: Boolean,
      default: false,
    },
    refundStatus: {
      type: String,
      enum: ["Pending", "Refunded", "Rejected", null],
      default: null,
    },
    refundAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);



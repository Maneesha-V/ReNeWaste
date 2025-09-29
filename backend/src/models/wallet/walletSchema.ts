import mongoose, { Schema } from "mongoose";
import {
  IWalletDocument,
  IWalletTransactionDocument,
} from "./interfaces/walletInterface";

export const walletTransactionSchema: Schema<IWalletTransactionDocument> =
  new Schema({
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "InProgress"],
      default: "Pending",
    },
    paidAt: {
      type: Date,
      default: null,
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
    refundRequested: {
      type: Boolean,
      default: false,
    },
    refundStatus: {
      type: String,
      enum: ["Pending", "Processing", "Refunded", "Rejected", null],
      default: null,
    },
    refundAt: {
      type: Date,
      default: null,
    },
    razorpayRefundId: {
      type: String,
      default: null,
    },
    inProgressExpiresAt: {
      type: Date,
      default: null,
    },
  },
    {
      timestamps: true,
    }
  );

export const walletSchema: Schema<IWalletDocument> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [walletTransactionSchema],
});

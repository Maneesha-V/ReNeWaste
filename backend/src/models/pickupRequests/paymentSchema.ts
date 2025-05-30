import { Schema } from "mongoose";
import { IPaymentDocument } from "./interfaces/paymentInterface";

export const PaymentSchema: Schema<IPaymentDocument> = new Schema(
  {
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
  },
  { _id: false } 
);

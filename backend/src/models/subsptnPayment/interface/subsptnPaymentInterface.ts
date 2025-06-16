import mongoose, { Document, Types } from "mongoose";

export interface ISubscriptionPayment  {
  wasteplantId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: "Pending" | "Paid" | "Failed";
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  expiredAt: Date | null;
  refundRequested: boolean;
  refundStatus: "Pending" | "Processing" | "Refunded" | "Rejected" | null;
  refundAt: Date | null;
}
export interface ISubscriptionPaymentDocument
  extends ISubscriptionPayment,
    Document {
  _id: Types.ObjectId;
}

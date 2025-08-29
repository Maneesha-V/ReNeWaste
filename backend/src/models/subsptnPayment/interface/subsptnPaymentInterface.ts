import mongoose, { Document, Types } from "mongoose";

export type PaymentStatus = "Pending" | "InProgress" | "Paid" | "Failed";
export type RefundStatus = "Pending" | "Processing" | "Refunded" | "Rejected" | null;
export interface ISubscriptionPayment  {
  wasteplantId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: PaymentStatus;
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  expiredAt: Date | null;
  refundRequested: boolean;
  refundStatus: RefundStatus;
  razorpayRefundId: string | null;
  refundAt: Date | null;
  inProgressExpiresAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
export interface ISubscriptionPaymentDocument
  extends ISubscriptionPayment,
    Document {
  _id: Types.ObjectId;
}

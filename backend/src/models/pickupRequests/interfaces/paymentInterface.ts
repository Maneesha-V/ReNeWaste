import { Types } from "mongoose";

export interface IPayment {
  status: "Pending" | "InProgress" | "Paid" | "Failed";
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  refundRequested: boolean;
  refundStatus: "Pending" | "Processing" | "Refunded" | "Rejected" | null;
  refundAt: Date | null;
  razorpayRefundId: string | null;
  inProgressExpiresAt: Date | null;
}
export interface IPaymentDocument extends IPayment, Document {
  _id: Types.ObjectId;
}

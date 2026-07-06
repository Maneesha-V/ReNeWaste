import { Types } from "mongoose";

export interface IPayment {
  status: "Pending" | "InProgress" | "Paid" | "Failed";
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  payoutStatus: "Pending" | "Credited" | "Completed";
  payoutAt: Date | null;
  refundRequested: boolean;
  refundStatus: "Pending" | "Processing" | "Refunded" | "Rejected" | null;
  refundAt: Date | null;
  razorpayRefundId: string | null;
  inProgressExpiresAt: Date | null;
  walletOrderId?: string | null;
  walletRefundId: string | null;
}
export interface IPaymentDocument extends IPayment, Document {
  _id: Types.ObjectId;
}

export type FetchPaymentPayloadRepo = {
  plantId: string;
  page: number;
  limit: number;
  search: string;
};
export type PaginatedPaymentsResultRepo = {
  payments: PaymentRecord[];
  total: number;
};
export type PaymentRecord = {
  _id: string;
  pickupId: string;
  wasteType: string;
  payment: {
    status: string;
    razorpayPaymentId: string;
    amount: number;
    paidAt: Date;
    refundRequested?: boolean;
    refundStatus?: "Pending" | "Processing" | "Refunded" | "Rejected" | null;
    refundAt?: Date;
    inProgressExpiresAt: Date;
    walletOrderId?: string | null;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};
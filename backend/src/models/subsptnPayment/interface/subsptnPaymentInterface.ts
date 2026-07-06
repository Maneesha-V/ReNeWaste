import mongoose, { Document, Types } from "mongoose";

export type PaymentStatus = "Pending" | "InProgress" | "Paid" | "Failed";
export type RefundStatus =
  | "Pending"
  | "Processing"
  | "Refunded"
  | "Rejected"
  | null;
export interface ISubscriptionPayment {
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

export type CreateSubsptnPaymentPayload = {
  plantId: string;
  planId: string;
  amount: number;
  paymentDetails: {
    method: string;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    paidAt: Date | null;
    refundRequested: boolean;
    refundStatus: string | null;
    refundAt: Date | null;
    inProgressExpiresAt: Date | null;
  };
};

export type PaymentUpdate = {
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  method?: string;
  refundRequested?: boolean;
  refundStatus?: string | null;
  refundAt?: Date | null;
  walletOrderId?: string | null;
};
export type UpdateSubscptnPayload = {
  planId: string;
  paymentUpdate: PaymentUpdate;
  plantId: string;
};

export interface PopulatedWasteplant {
  _id: string;
  plantName: string;
  ownerName: string;
}
export interface PopulatedPlan {
  _id: string;
  planName: string;
  billingCycle: string;
}

export interface SubscriptionPaymentHisDTO {
  _id: string;
  wasteplantId: PopulatedWasteplant;
  planId: PopulatedPlan;
  status: string;
  method: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  paidAt: Date | null;
  expiredAt: Date | null;
  refundRequested: boolean;
  refundStatus: RefundStatus;
  razorpayRefundId: string | null;
  refundAt: Date | null;
  inProgressExpiresAt: Date | null;
}

export interface SubscriptionPaymentHisRepoResp {
  paymentHis: SubscriptionPaymentHisDTO[];
  total: number;
}

export type UpdateRefundStatusRepoReq = {
  adminId: string;
  subPayId: string;
  refundStatus: RefundStatus;
};
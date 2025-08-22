import { ISubscriptionPaymentDocument, RefundStatus } from "../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { BaseDTO } from "../base/BaseDTO";

export type SubcrptnRefundStatus = "Pending" | "Processing" | "Refunded" | "Rejected" | null;
export type SubcrptnPaymentStatus = "Pending" | "Paid" | "Failed" | "InProgress";
export interface SubscriptionPaymentDTO extends BaseDTO {
  wasteplantId: string;
   planId: string;
   status: SubcrptnPaymentStatus;
   method: string;
   razorpayOrderId: string | null;
   razorpayPaymentId: string | null;
   razorpaySignature: string | null;
   amount: number;
   paidAt: Date | null;
   expiredAt: Date | null;
   refundRequested: boolean;
   refundStatus: SubcrptnRefundStatus;
  refundAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
export interface PaginatedReturnPaymentHis {
  total: number;
  wasteplants: SubscriptionPaymentDTO[];
}
export interface SubscriptionPaymentHisResult {
  paymentHis: SubscriptionPaymentHisDTO[];
  total: number;
};
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
  refundAt: Date | null;
}
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
export interface RetrySubPaymntReq {
    plantId: string;
    planId: string;
    amount: number;
    subPaymtId: string;
}
export interface RetrySubPaymntRes {
    orderId: string;
    amount: number;
    currency: string;
    planId: string;
    inProgressExpiry: string;
}
export interface SubCreatePaymtReq {
      amount: number;
      planId: string;
      plantName: string;
      plantId: string;
}
export interface SubCreatePaymtResp {
    orderId: string;
    amount: number;
    currency: string;
    subscriptionPaymentId: string;
    // inProgressExpiry: string;
}
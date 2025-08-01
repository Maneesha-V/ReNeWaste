import { ISubscriptionPaymentDocument } from "../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { PaymentRecord } from "../../repositories/pickupReq/types/pickupTypes";

export type SubCreatePaymtPayload = {
      amount: number;
      planId: string;
      plantName: string;
      plantId: string;
}
export type ReurnSubcptnCreatePaymt = {
    orderId: string;
    amount: number;
    currency: string;
    subscriptionPaymentId: string;
}
export type PaymentData = {
     razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planId: string;
      amount: number;
      billingCycle: string;
}
export type VerifyPaymtPayload = {
    paymentData: PaymentData;
    plantId: string;
}
export type PaymentUpdate = {
      status: string;
      razorpayOrderId: string | null;
      razorpayPaymentId: string | null;
      razorpaySignature: string | null;
      amount: number;
      paidAt: Date| null;
      method?: string;
      refundRequested?: boolean,
      refundStatus?: string| null,
      refundAt?: Date| null
    };
export type UpdateSubscptnPayload = {
    planId: string;
    paymentUpdate: PaymentUpdate;
    plantId: string;
}
export type PlanData = {
  planName: string;
  plantName: string;
  ownerName: string;
}

export type ReturnSubcptnPaymentResult = {
  paymentData: any; 
  planData: PlanData;
}
export type RetryPaymntPayload = {
    plantId: string;
    planId: string;
    amount: number;
    subPaymtId: string;
}
export type ReturnRetryPaymntPayload = {
    orderId: string;
    amount: number;
    currency: string;
    planId: string;
    expires: string;
}
export type FetchPaymentPayload = {
  plantId: string
  page: number;
  limit: number;
  search: string;
}
export type PaginatedPaymentsResult = {
  payments: PaymentRecord[];
  total: number;
}
export type RefundStatus = "Pending" | "Processing" | "Refunded" | "Rejected" | null;

export type StatusUpdateReq = {
  pickupReqId: string;
  status: RefundStatus;
}
export type UpdateStatusPayload = {
  plantId: string;
  statusUpdateData :StatusUpdateReq
}
export type RefundDataReq = {
  pickupReqId: string;  
  amount: number;
  razorpayPaymentId: string;
}
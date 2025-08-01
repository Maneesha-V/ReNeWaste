import { PaymentDTO } from "./pickupReqDTO";

export interface CreatePaymentReq {
  pickupReqId: string;
  amount: number;
  userId: string;
}
export interface CreatePaymentResp
  extends Pick<CreatePaymentReq, "pickupReqId" | "amount"> {
  orderId: string;
  currency: string;
  expiresAt: string;
}
export interface VerifyPaymentReq extends CreatePaymentReq {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface VerifyPaymentResp {
  pickupReqId: string;
  payment: PaymentDTO
}
export type RefundStatus = "Pending" | "Processing" | "Refunded" | "Rejected" | null;

export interface StatusUpdateReq {
  pickupReqId: string;
  status: RefundStatus;
}
export interface UpdateStatusReq {
  plantId: string;
  statusUpdateData :StatusUpdateReq
}
export interface RefundStatusUpdateResp {
  _id: string; 
  refundStatus: RefundStatus;
  inProgressExpiresAt: Date | null;
}

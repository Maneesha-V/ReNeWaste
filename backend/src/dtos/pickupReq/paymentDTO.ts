import { PaymentDTO } from "./pickupReqDTO";

export interface CreatePaymentReq {
  pickupReqId: string;
  amount: number;
  userId: string;
  method: string;
}
export interface CreatePaymentResp
  extends Pick<CreatePaymentReq, "pickupReqId" | "amount"> {
  orderId: string;
  currency: string;
  expiresAt: string;
}
// export interface VerifyPaymentReq extends CreatePaymentReq {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }
export type VerifyPaymentReq = Pick<CreatePaymentReq, "amount" | "pickupReqId" | "userId"> & {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface VerifyPaymentResp {
  pickupReqId: string;
  payment: PaymentDTO;
}
export type RefundStatus =
  | "Pending"
  | "Processing"
  | "Refunded"
  | "Rejected"
  | null;

export interface StatusUpdateReq {
  pickupReqId: string;
  status: RefundStatus;
}
export interface UpdateStatusReq {
  plantId: string;
  statusUpdateData: StatusUpdateReq;
}
export interface RefundStatusUpdateResp {
  _id: string;
  refundStatus: RefundStatus;
  inProgressExpiresAt: Date | null;
}
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
export type VerifyWalletPickupPaymentReq = {
pickupReqId: string;
        amount: number;
        method: string;
}

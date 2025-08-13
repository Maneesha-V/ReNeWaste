export type RefundStatus = "Pending" | "Processing" | "Refunded" | "Rejected" | null;
export type PaymentStatus = "Pending" | "InProgress" | "Paid" | "Failed";
export type RazorpayResponse = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export type RepaymentOrderResponse = {
  orderId: string | null;
  amount: number;
  currency: string;
  pickupReqId: string;
  expiresAt: string;
}
export type PickupReqPayment = {
  status: PaymentStatus;
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  refundRequested: boolean;
  refundStatus: RefundStatus;
  refundAt: Date | null;
  razorpayRefundId: string | null;
  inProgressExpiresAt: Date | null;
}
export type VerifyPaymentPayload = RazorpayResponse & {
  pickupReqId: string;
  amount: number;
};
export type CreatePaymentPayload = Pick<VerifyPaymentPayload,"pickupReqId" | "amount">
export type CreatePaymentResponse =  Pick<RepaymentOrderResponse, "amount" | "currency" | "orderId" | "pickupReqId">;


export type VerifyPaymentResponse = {
  message: string;
  updatedPayment: {
    pickupReqId: string;
    payment: PickupReqPayment;
  }
};
export type ReturnGetAllPayments = {
  payments: PaymentSummary[]
  total: number;
}
export type PaymentSummary = {
  _id: string;
  pickupId: string;
  originalPickupDate: string; 
  rescheduledPickupDate?: string | null;
  wasteType: string;
  status: string;
  payment: {
    status: string;
    amount: number;
    method: string;
    paidAt: string | null;
    refundStatus: string | null; 
    razorpayOrderId: string | null;
    refundRequested: boolean;
    refundAt: string | null;
    inProgressExpiresAt: string | null;
  };
}
export type UpdateStatusPayload= { 
  pickupReqId: string; 
  status: string; 
}
export interface RefundStatusUpdateResp {
  _id: string; 
  refundStatus: RefundStatus;
  inProgressExpiresAt: Date | null;
}
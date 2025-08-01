

export type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  pickupReqId?: string;
  amount: number;
}
export type SubptnVerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId?: string;
  amount: number;
  subPaymtId?: string;
  billingCycle: string;
}

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
    refundAt: Date;
    method?: string; 
    razorpayOrderId?: string;
    razorpaySignature?: string;
    inProgressExpiresAt: Date;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};

export type retryPaymentData = {
  planId: string;
  amount: number;
  subPaymtId: string;
}
export type UpdateStatusPayload= { 
  pickupReqId: string; 
  status: string; 
}
export type RefundPaymntPayload = {
  pickupReqId: string; 
  amount: number;
  razorpayPaymentId: string;
};

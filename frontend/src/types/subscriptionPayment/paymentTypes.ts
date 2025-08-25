import { MsgSuccessResp } from "../common/commonTypes";

export type SubscriptionPaymentHisResult = {
  paymentHis: SubscriptionPaymentHisDTO[];
  total: number;
};
export type SubscriptionPaymentHisDTO = {
  _id: string;
  wasteplantId: { _id: string; plantName: string, ownerName: string };
  planId: { _id: string; planName: string, billingCycle: string };
  status: string;
  method: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  paidAt: Date | null;
  expiredAt: Date | null;
  refundRequested: boolean;
  refundStatus: string;
  refundAt: Date | null;
  inProgressExpiresAt: Date | null;
};
export type RetrySubptnPaymntResp = {
  orderId: string;
  amount: number;
  currency: string;
  planId: string;
};
export type subPaymnetPayload = {
  amount: number;
  planId: string;
  plantName: string;
};
export type SubCreatePaymtResp = {
  paymentOrder: {
    orderId: string;
    amount: number;
    currency: string;
    subscriptionPaymentId: string;
    // inProgressExpiry: string;
  };
  success: boolean;
};
export type SubptnVerifyPaymenReq = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
  amount?: number;
  // subPaymtId?: string;
  billingCycle?: string;
}
export type SubptnVerifyPaymenResp = MsgSuccessResp & {
  updatePayment: {
    subPayId: string;
    expiredAt: Date | null
  }
}
export type ReturnPaymentHis = {
  paymentData: SubscriptionPaymentHisDTO[]; 
}
export type SubscptnCancelReq = {
  subPayId: string;
  reason: string;
}
export type UpdateRefundStatusReq = {
  subPayId: string;
  refundStatus:  string
}
export type UpdateRefundStatusResp = {
  message: string;
  statusUpdate: {
    subPayId: string;
    refundStatus: string;
  }
}

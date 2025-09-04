import { MsgSuccessResp } from "../common/commonTypes";

export type SubscriptionPaymentHisResult = {
  paymentHis: SubscriptionPaymentHisDTO[];
  total: number;
};
export type SubscriptionPaymentDTO = {
  _id: string;
  wasteplantId: string;
  planId: string;
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
export type RetryPaymentData = {
  planId: string;
  amount: number;
  subPaymtId: string;
}
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
export type PaymentOrder = {
    orderId: string;
    amount: number;
    currency: string;
    subscriptionPaymentId: string;
}
export type SubCreatePaymtResp = {
  paymentOrder: PaymentOrder;
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
export  type SubscptnCancelResp = {
  message: string;
  payment: SubscriptionPaymentDTO;
}
export type UpdateRefundStatusReq = {
  subPayId: string;
  refundStatus:  string
}
export type UpdateRefundStatusResp = {
  message: string;
  statusUpdate: SubscriptionPaymentDTO;
}
export type refundPayReq = {
  subPayId: string;
  refundStatus:  string
}
export type refundPayResp = {
  message: string;
  statusUpdate: SubscriptionPaymentDTO;
}

export type FetchSubscrptnPayments = {
  success: boolean;
  payments: {
    paymentData: SubscriptionPaymentHisDTO[];
  }
}
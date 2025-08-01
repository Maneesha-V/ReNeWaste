export type SubscriptionPaymentHisResult = {
  paymentHis: SubscriptionPaymentHisDTO[];
  total: number;
};
export type SubscriptionPaymentHisDTO = {
  _id: string;
  wasteplantId: { _id: string; plantName: string };
  planId: { _id: string; planName: string };
  status: string;
  method: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  paidAt: Date | null;
  expiredAt: Date | null;
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
};

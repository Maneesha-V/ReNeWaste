export type WalletDTO = {
  _id: string;
    userId: string;
    balance: number;
    transactions: TransactionDTO[];
}

export interface TransactionDTO {
  _id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  paidAt: Date | null;
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  refundRequested: boolean;
  refundStatus: string | null;
  refundAt: Date | null;
  razorpayRefundId: string | null;
  inProgressExpiresAt: Date | null;
  updatedAt: Date;
}

export type AddMoneyReq = {
  amount: number;
  description: string;
  type: string;
};
export type CreateWalletOrderResp = {
  orderId: string;
  amount: number;
  currency: string;
  walletId: string;
  expiresAt: string;
};
export type VerifyWalletAddPaymentReq = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  walletId: string;
  amount: number;
};
export type VerifyWalletAddPaymentResp = {
  message: string;
  walletVerPayOrder: {
    amount: number;
    balance: number;
    transactionId: string;
  };
};
export type GetWalletResp = {
  userWallet: WalletDTO;
}
export type RetryAddMoneyResp = {
        orderId: string;
      amount: number;
      currency: string;
      walletId: string;
      expiresAt: string;
}

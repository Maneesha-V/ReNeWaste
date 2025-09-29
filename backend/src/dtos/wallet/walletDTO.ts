import { BaseDTO } from "../base/BaseDTO";

export interface WalletDTO extends BaseDTO {
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
export type AddMoneyToWalletReq = {
userId: string;
data: {
  amount: number;
  description: string;
  type: string;
}
}
export type CreateWalletOrderResp = {
  orderId: string;
  amount: number;
  currency: string;
  walletId: string;
  expiresAt: string;
}
export type VerifyWalletAddPayload = {
                 razorpay_order_id: string;
                 razorpay_payment_id: string;
                 razorpay_signature: string;
                 walletId: string;
                 amount: number;
}
export type VerifyWalletAddPaymentReq = {
userId: string;
data: VerifyWalletAddPayload
}
export type VerifyWalletAddPaymentResp = {
  amount: number;
balance: number;
    transactionId: string;
}
export type RetryWalletAddPaymentResp = {
      orderId: string;
      amount: number;
      currency: string;
      walletId: string;
      expiresAt: string;
}

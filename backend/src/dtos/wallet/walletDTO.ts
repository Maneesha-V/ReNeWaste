import { IWalletTransactionDocument } from "../../models/wallet/interfaces/walletInterface";
import { BaseDTO } from "../base/BaseDTO";

export interface WalletDTO extends BaseDTO {
  accountId: string;
  accountType: string;
  balance: number;
  holdingBalance?: number;
  transactions: TransactionDTO[];
}

export interface TransactionDTO {
  _id: string;
  type: string;
  subType? : string;
  pickupReqId ?: string;
  amount: number;
  description: string;
  settlementStatus: string;
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
  accountId: string;
  accountType: string;
  data: {
    amount: number;
    description: string;
    type: string;
    subType: string;
    pickupReqId: string;
  };
};

export type CreateWalletOrderResp = {
  orderId: string;
  amount: number;
  currency: string;
  walletId: string;
  expiresAt: string;
};
export type VerifyWalletAddPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  walletId: string;
  amount: number;
};
export type VerifyWalletAddPaymentReq = {
  accountId: string;
  accountType: string;
  data: VerifyWalletAddPayload;
};
export type VerifyWalletAddPaymentResp = {
  amount: number;
  balance: number;
  transactionId: string;
};
export type RetryWalletAddPaymentResp = {
  orderId: string;
  amount: number;
  currency: string;
  walletId: string;
  expiresAt: string;
};


export type GetWalletWPResp = {
  transactions: TransactionDTO[],
  balance: number;
  holdingBalance: number;
  total: number;
  earnings: number;
}
export type PaginatedWPWallet = {
  transactions: IWalletTransactionDocument[];
  total: number;
  earnings: number;
}
export type PaginatedDriverWallet = {
  transactions: IWalletTransactionDocument[];
  total: number;
  rewards: number;
}
export type GetWalletDriverResp = {
  transactions: TransactionDTO[],
  balance: number;
  total: number;
  rewards: number;
}
export type GetWalletUserResp = {
  transactions: TransactionDTO[],
  balance: number;
  total: number;
}

export interface RevenueWPTrendDTO { 
  totalRevenue: number;
  date: string; 
  wasteType: "Residential" | "Commercial";
}

export type GetWalletSAResp = {
  transactions: TransactionDTO[],
  balance: number;
  holdingBalance: number;
  total: number;
  earnings: number;
}

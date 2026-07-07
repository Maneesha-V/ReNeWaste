import mongoose, { Document, Types } from "mongoose";

export interface IWalletTransaction {
  type: "Credit"| "Debit";
  subType: "PickupPayment"| "Settlement"|"SettlementEarning" | "DriverEarning"| "Withdrawal"| "Refund"|"ExternalRefund" |"UserDeposit" | "SubscriptionPayment";
  pickupReqId?: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  settlementStatus: "NotApplicable"| "Pending"| "Completed";
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
  createdAt: Date;
  updatedAt: Date;
}
export interface IWalletTransactionDocument
  extends IWalletTransaction,
    Document {
  _id: Types.ObjectId;
}
export interface IWallet {
  accountId: mongoose.Types.ObjectId;
  accountType: string;
  balance: number;
  holdingBalance: number;
  transactions: Types.DocumentArray<IWalletTransactionDocument>;
}
export interface IWalletDocument extends IWallet, Document {
  _id: Types.ObjectId;
}

export type AddMoneyToWallet = {
  walletId: string;
  data: {
    amount: number;
    description: string;
    type: string;
    subType: string;
    pickupReqId: string;
    status: string;
    paidAt: Date;
  };
};

export type AddMoneyToWalletRepoReq = {
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
export type CreateWalletReq = {
  accountId: string;
  accountType: string;
}
export interface RevenueWPTrendRepo { 
  totalRevenue: number;
  date: string; 
  wasteType: "Residential" | "Commercial";
}
export type FetchFilteredWPRevenueResp = {
  revenueTrends: RevenueWPTrendRepo[];
  wasteplantTotRevenue: number;
}
export type PaginatedGetWalletReq = {
  walletId: string;
  page: number,
  limit: number,
  search: string,
}
export type PaginatedUserWallet = {
    transactions: IWalletTransactionDocument[];
    total: number;
}
  export type FetchWPDashboardRepo = {
    filter: string;
    plantId: string;
    from: string;
    to: string;
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
  export type PaginatedSuperAdminWallet = {
    transactions: IWalletTransactionDocument[];
    total: number;
  }
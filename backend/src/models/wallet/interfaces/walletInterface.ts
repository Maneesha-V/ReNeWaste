import mongoose, { Document, Types } from "mongoose";

export interface IWalletTransaction {
  type: "Credit"| "Debit";
  subType: "PickupPayment"| "Settlement"|"SettlementEarning" | "DriverEarning"| "Withdrawal"| "Refund"|"ExternalRefund" |"UserDeposit";
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

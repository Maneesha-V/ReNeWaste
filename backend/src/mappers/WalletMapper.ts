import { TransactionDTO, WalletDTO } from "../dtos/wallet/walletDTO";
import { IWalletDocument, IWalletTransactionDocument } from "../models/wallet/interfaces/walletInterface";

export class WalletMapper {
  static mapWalletDTO(doc: IWalletDocument): WalletDTO {
    return {
        _id: doc?._id.toString(),
        accountId: doc?.accountId.toString(),
        accountType : doc?.accountType,
    balance: doc?.balance ?? 0,
    transactions: doc?.transactions.map((tx) => this.mapTransactionDTO(tx)) ?? [],
    }
  }
  static mapTransactionDTO(doc: IWalletTransactionDocument): TransactionDTO {
    return {
        _id: doc._id.toString(),
        type: doc?.type,
      amount: doc?.amount,
      description: doc?.description,
      status: doc?.status,
      method: doc?.method,
      razorpayOrderId: doc?.razorpayOrderId ?? null,
      razorpayPaymentId: doc?.razorpayPaymentId ?? null,
      razorpaySignature: doc?.razorpaySignature ?? null,
      paidAt: doc?.paidAt ?? null,
      refundRequested: doc?.refundRequested ?? false,
      refundStatus: doc?.refundStatus ?? null,
      refundAt: doc?.refundAt ?? null,
      razorpayRefundId: doc?.razorpayRefundId ?? null,
      inProgressExpiresAt: doc?.inProgressExpiresAt ?? null,
      updatedAt: doc?.updatedAt,
    }
  }
  static mapTransactionsDTO(docs: IWalletTransactionDocument[]): TransactionDTO[] {
     return docs.map((doc) => this.mapTransactionDTO(doc));
  }
}
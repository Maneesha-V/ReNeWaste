"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMapper = void 0;
class WalletMapper {
    static mapWalletDTO(doc) {
        return {
            _id: doc?._id.toString(),
            accountId: doc?.accountId.toString(),
            accountType: doc?.accountType,
            balance: doc?.balance ?? 0,
            holdingBalance: doc?.holdingBalance ?? 0,
            transactions: doc?.transactions.map((tx) => this.mapTransactionDTO(tx)) ?? [],
        };
    }
    static mapTransactionDTO(doc) {
        return {
            _id: doc._id.toString(),
            type: doc?.type,
            subType: doc?.subType,
            pickupReqId: doc?.pickupReqId?.toString(),
            amount: doc?.amount,
            description: doc?.description,
            settlementStatus: doc?.settlementStatus,
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
        };
    }
    static mapTransactionsDTO(docs) {
        return docs.map((doc) => this.mapTransactionDTO(doc));
    }
}
exports.WalletMapper = WalletMapper;

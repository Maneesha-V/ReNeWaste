"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletSchema = exports.walletTransactionSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.walletTransactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Credit", "Debit"],
        required: true,
    },
    subType: {
        type: String,
        enum: [
            "PickupPayment",
            "Settlement",
            "SettlementEarning",
            "DriverEarning",
            "Withdrawal",
            "Refund",
            "UserDeposit",
            "ExternalRefund",
            "SubscriptionPayment"
        ],
        required: true,
    },
    pickupReqId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "PickupRequests",
        default: null,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: String,
    settlementStatus: {
        type: String,
        enum: ["NotApplicable", "Pending", "Completed"],
        default: "NotApplicable",
    },
    status: {
        type: String,
        enum: ["Paid", "Pending", "Failed", "InProgress"],
        default: "Pending",
    },
    paidAt: {
        type: Date,
        default: null,
    },
    method: {
        type: String,
        default: "Wallet",
    },
    razorpayOrderId: {
        type: String,
        default: null,
    },
    razorpayPaymentId: {
        type: String,
        default: null,
    },
    razorpaySignature: {
        type: String,
        default: null,
    },
    refundRequested: {
        type: Boolean,
        default: false,
    },
    refundStatus: {
        type: String,
        enum: ["Pending", "Processing", "Refunded", "Rejected", null],
        default: null,
    },
    refundAt: {
        type: Date,
        default: null,
    },
    razorpayRefundId: {
        type: String,
        default: null,
    },
    inProgressExpiresAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
exports.walletSchema = new mongoose_1.Schema({
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    accountType: {
        type: String,
        enum: ["User", "Driver", "WastePlant", "SuperAdmin"],
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    holdingBalance: {
        type: Number,
        default: 0,
    },
    transactions: [exports.walletTransactionSchema],
});

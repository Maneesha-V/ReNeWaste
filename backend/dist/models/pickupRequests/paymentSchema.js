"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ["Pending", "InProgress", "Paid", "Failed"],
        default: "Pending",
    },
    method: {
        type: String,
        default: "Razorpay",
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
    amount: {
        type: Number,
        required: true,
    },
    paidAt: {
        type: Date,
        default: null,
    },
    payoutStatus: {
        type: String,
        enum: ["Pending", "Credited", "Completed"],
        default: "Pending",
    },
    payoutAt: {
        type: Date,
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
    walletOrderId: {
        type: String,
        default: null,
    },
    walletRefundId: {
        type: String,
        default: null,
    }
}, { _id: false });

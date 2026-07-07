"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SubscriptionPlanSchema = new mongoose_1.Schema({
    planName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    billingCycle: {
        type: String,
        enum: ["Monthly", "Yearly"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    driverLimit: {
        type: Number,
        required: true,
        min: 0,
    },
    userLimit: {
        type: Number,
        required: true,
        min: 0,
    },
    truckLimit: {
        type: Number,
        required: true,
        min: 0,
    },
    trialDays: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});

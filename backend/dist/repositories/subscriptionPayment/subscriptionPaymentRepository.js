"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPaymentRepository = void 0;
const inversify_1 = require("inversify");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const subsptnPaymentModel_1 = require("../../models/subsptnPayment/subsptnPaymentModel");
const mongoose_1 = __importDefault(require("mongoose"));
let SubscriptionPaymentRepository = class SubscriptionPaymentRepository extends baseRepository_1.default {
    constructor() {
        super(subsptnPaymentModel_1.SubscriptionPaymentModel);
    }
    async createSubscriptionPayment(data) {
        const { plantId, planId, amount, paymentDetails } = data;
        const newPayment = new this.model({
            wasteplantId: plantId,
            planId: planId,
            amount: amount,
            ...paymentDetails,
        });
        await newPayment.save();
        return newPayment;
    }
    async updateSubscriptionPayment(data) {
        const { planId, paymentUpdate, plantId } = data;
        const updatedPayment = await this.model.findOneAndUpdate({
            planId: planId,
            wasteplantId: plantId,
        }, {
            $set: paymentUpdate,
        }, {
            new: true,
        });
        if (!updatedPayment) {
            throw new Error("Subscription payment not found for update.");
        }
        return updatedPayment;
    }
    async findSubscriptionPayments(plantId) {
        return await this.model
            .find({ wasteplantId: plantId })
            .populate({ path: "wasteplantId", select: "plantName ownerName" })
            .populate({ path: "planId", select: "planName billingCycle" });
    }
    async findSubscriptionPaymentById(id) {
        return await this.model.findById(id);
    }
    async updateSubscriptionPaymentById(id, paymentUpdate) {
        const updatedData = await this.model.findByIdAndUpdate({
            _id: new mongoose_1.default.Types.ObjectId(id),
        }, {
            $set: paymentUpdate,
        }, { new: true });
        if (!updatedData) {
            throw new Error("Subscription payment not found for update.");
        }
        return updatedData;
    }
    async findPaidSubscriptionPayments() {
        return await this.model.find({ status: "Paid" });
    }
    async getAllSubscptnPayments(data) {
        const { page, limit, search } = data;
        const skip = (page - 1) * limit;
        const searchRegex = new RegExp(search, "i");
        const date = new Date(search);
        const isValidDate = !isNaN(date.getTime());
        const matchStage = {
            $match: {
                $or: [
                    { status: { $regex: searchRegex } },
                    { method: { $regex: searchRegex } },
                    { "wasteplant.plantName": { $regex: searchRegex } },
                    { "plan.planName": { $regex: searchRegex } },
                    ...(isValidDate
                        ? [
                            {
                                paidAt: {
                                    $gte: new Date(date.setHours(0, 0, 0, 0)),
                                    $lt: new Date(date.setHours(23, 59, 59, 999)),
                                },
                            },
                        ]
                        : []),
                    ...(isNaN(Number(search)) ? [] : [{ amount: Number(search) }]),
                ],
            },
        };
        const baseAggregation = [
            {
                $lookup: {
                    from: "wasteplants",
                    localField: "wasteplantId",
                    foreignField: "_id",
                    as: "wasteplant",
                },
            },
            { $unwind: "$wasteplant" },
            {
                $lookup: {
                    from: "subscriptionplans",
                    localField: "planId",
                    foreignField: "_id",
                    as: "plan",
                },
            },
            { $unwind: "$plan" },
        ];
        const aggregation = [
            ...baseAggregation,
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    wasteplantId: "$wasteplant",
                    planId: "$plan",
                    status: 1,
                    method: 1,
                    razorpayOrderId: 1,
                    razorpayPaymentId: 1,
                    razorpaySignature: 1,
                    amount: 1,
                    paidAt: 1,
                    expiredAt: 1,
                    refundRequested: 1,
                    refundStatus: 1,
                    refundAt: 1,
                    inProgressExpiresAt: 1,
                },
            },
        ];
        const result = await this.model.aggregate(aggregation);
        const totalAggregation = [
            ...baseAggregation,
            matchStage,
            { $count: "total" },
        ];
        const totalResult = await this.model.aggregate(totalAggregation);
        const total = totalResult[0]?.total || 0;
        return { paymentHis: result, total };
    }
    async findLatestInProgressPayment(plantId) {
        const payment = await this.model
            .findOne({
            wasteplantId: plantId,
            status: "InProgress",
        })
            .sort({ createdAt: -1 });
        const now = new Date();
        if (payment &&
            payment.inProgressExpiresAt &&
            payment.inProgressExpiresAt < now) {
            payment.status = "Pending";
            payment.inProgressExpiresAt = null;
            await payment.save();
            return null;
        }
        if (payment &&
            payment.inProgressExpiresAt &&
            payment.inProgressExpiresAt > now) {
            return payment;
        }
        return null;
    }
    async findPlantSubscriptionPayment(plantId) {
        const now = new Date();
        return await this.model.findOne({
            wasteplantId: plantId,
            // status: {$or: ["Paid","Pending"]},
            // expiredAt : {$gt: now}
        });
    }
    async updateSubptnPaymentStatus(subPayId) {
        const updatedSubptnRequest = await this.model.findByIdAndUpdate(subPayId, {
            $set: {
                refundRequested: true,
            },
        }, { new: true });
        if (!updatedSubptnRequest) {
            throw new Error("Subscription request not found.");
        }
        return updatedSubptnRequest;
    }
    async updateRefundStatusPayment(data) {
        const { subPayId, refundStatus } = data;
        const payment = await this.model.findByIdAndUpdate(subPayId, {
            $set: {
                refundStatus: refundStatus,
            },
        }, { new: true });
        if (!payment) {
            throw new Error("Payment not found.");
        }
        return payment;
    }
};
exports.SubscriptionPaymentRepository = SubscriptionPaymentRepository;
exports.SubscriptionPaymentRepository = SubscriptionPaymentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SubscriptionPaymentRepository);

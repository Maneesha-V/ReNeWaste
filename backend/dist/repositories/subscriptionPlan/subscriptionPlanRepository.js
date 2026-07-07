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
exports.SubscriptionPlanRepository = void 0;
const inversify_1 = require("inversify");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const subscriptionPlanModel_1 = require("../../models/subscriptionPlans/subscriptionPlanModel");
let SubscriptionPlanRepository = class SubscriptionPlanRepository extends baseRepository_1.default {
    constructor() {
        super(subscriptionPlanModel_1.SubscriptionPlanModel);
    }
    async createSubscriptionPlan(data) {
        const newSubscriptionPlan = new this.model(data);
        return await newSubscriptionPlan.save();
    }
    async checkPlanNameExist(planName) {
        return await this.model.findOne({
            planName: new RegExp(`^${planName}$`, "i"),
        });
    }
    async getAllSubscriptionPlans(data) {
        const { page, limit, search } = data;
        const searchRegex = new RegExp(search, "i");
        const query = {
            isDeleted: false,
            $or: [
                { planName: { $regex: searchRegex } },
                { billingCycle: { $regex: searchRegex } },
                { status: { $regex: searchRegex } },
            ],
        };
        if (!isNaN(Number(search))) {
            query.$or?.push({ price: Number(search) });
        }
        const skip = (page - 1) * limit;
        const subscriptionPlans = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.model.countDocuments(query);
        return { subscriptionPlans, total };
    }
    async getActiveSubscriptionPlans() {
        return this.model.find({ isDeleted: false, status: "Active" });
    }
    async deleteSubscriptionPlanById(planId) {
        // const updatedData = await this.model.findByIdAndDelete(planId);
        const updatedData = await this.model.findByIdAndUpdate(planId, { isDeleted: true, status: "Inactive" }, { new: true });
        if (!updatedData) {
            throw new Error("Subscription plan is not deleted.");
        }
        return updatedData;
    }
    async getSubscriptionPlanById(planId) {
        const plan = await this.model.findById(planId);
        if (!plan) {
            throw new Error("Plan not found.");
        }
        return plan;
    }
    async updateSubscriptionPlanById({ id, data }) {
        const updatedPlan = await this.model.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!updatedPlan) {
            throw new Error("Subscription plan not found");
        }
        return updatedPlan;
    }
};
exports.SubscriptionPlanRepository = SubscriptionPlanRepository;
exports.SubscriptionPlanRepository = SubscriptionPlanRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SubscriptionPlanRepository);

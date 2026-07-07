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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let SubscriptionController = class SubscriptionController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async createSubscriptionPlan(req, res, next) {
        try {
            console.log(req.body);
            const adminId = req.user?.id;
            if (!adminId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const subptnPlanData = req.body;
            const newSubptnPlan = await this.subscriptionService.createSubscriptionPlan(subptnPlanData);
            console.log("newSubptnPlan", newSubptnPlan);
            res.status(constantUtils_1.STATUS_CODES.CREATED).json({
                success: true,
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_CREATED,
            });
        }
        catch (error) {
            console.log("err", error);
            next(error);
        }
    }
    async fetchSubscriptionPlans(req, res, next) {
        try {
            console.log(req.query);
            const DEFAULT_LIMIT = 5;
            const MAX_LIMIT = 50;
            const page = parseInt(req.query.page) || 1;
            let limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
            const search = req.query.search || "";
            const { subscriptionPlans, total } = await this.subscriptionService.fetchSubscriptionPlans({
                page,
                limit,
                search,
            });
            // console.log("subscriptionPlans", subscriptionPlans);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_PLANS,
                subscriptionPlans,
                total,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async deleteSubscriptionPlan(req, res, next) {
        try {
            console.log("body", req.body);
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const plan = await this.subscriptionService.deleteSubscriptionPlan(id);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_DELETED,
                plan,
            });
        }
        catch (error) {
            console.error("Error in deleting plan:", error);
            next(error);
        }
    }
    async getSubscriptionPlanById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const subscriptionPlan = await this.subscriptionService.getSubscriptionPlanById(id);
            console.log("subscriptionPlan", subscriptionPlan);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ subscriptionPlan });
        }
        catch (error) {
            console.error("Error fetching subscription plan:", error);
            next(error);
        }
    }
    async updateSubscriptionPlanById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const updatedData = req.body;
            const updatedSubscriptionPlan = await this.subscriptionService.updateSubscriptionPlanById({
                id,
                data: updatedData,
            });
            console.log("updatedSubscriptionPlan", updatedSubscriptionPlan);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_UPDATED,
                updatedSubscriptionPlan,
            });
        }
        catch (error) {
            console.error("Error updating subscription plan:", error);
            next(error);
        }
    }
};
exports.SubscriptionController = SubscriptionController;
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SuperAdminSubscriptionService)),
    __metadata("design:paramtypes", [Object])
], SubscriptionController);

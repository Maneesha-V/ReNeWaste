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
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let SubscriptionController = class SubscriptionController {
    _subscriptionService;
    _paymentService;
    constructor(_subscriptionService, _paymentService) {
        this._subscriptionService = _subscriptionService;
        this._paymentService = _paymentService;
    }
    async fetchSubscriptionPlan(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const selectedPlan = await this._subscriptionService.fetchSubscriptionPlan(plantId);
            console.log("selectedPlan", selectedPlan);
            const subPaymentHistory = await this._paymentService.fetchSubscriptionPayments(plantId);
            console.log("subPaymentHistory", subPaymentHistory);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.SUBSCRIPTION_PLAN,
                selectedPlan,
                subPaymentHistory,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchSubscriptionPlans(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.WASTEPLANT.ERROR.ID_REQUIRED);
            }
            const subscriptionPlans = await this._subscriptionService.fetchSubscriptionPlans(plantId);
            // console.log("subscriptionPlans", subscriptionPlans);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_PLANS,
                subscriptionPlans,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async cancelSubcptReason(req, res, next) {
        try {
            const { subPayId } = req.params;
            const { reason } = req.body;
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            console.log({ subPayId, plantId, reason });
            const payment = await this._subscriptionService.cancelSubcptReason(plantId, subPayId, reason);
            console.log("payment", payment);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.SUBSCRIPTION_CANCEL,
                payment,
            });
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
};
exports.SubscriptionController = SubscriptionController;
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantSubscriptionService)),
    __param(1, (0, inversify_1.inject)(types_1.default.PlantPaymentService)),
    __metadata("design:paramtypes", [Object, Object])
], SubscriptionController);

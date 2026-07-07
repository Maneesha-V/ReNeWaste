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
exports.PaymentController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let PaymentController = class PaymentController {
    _paymentService;
    constructor(_paymentService) {
        this._paymentService = _paymentService;
    }
    async fetchPayments(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || "";
            const { payments, total } = await this._paymentService.fetchPayments({
                plantId,
                page,
                limit,
                search,
            });
            console.log("payments", payments);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                payments,
                total,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async createPaymentOrder(req, res, next) {
        try {
            const plantId = req.user?.id;
            const { planId } = req.body;
            console.log("plant", plantId);
            console.log("amount", planId);
            if (!plantId || !planId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const paymentOrder = await this._paymentService.createPaymentOrder({
                planId,
                plantId,
            });
            console.log("paymentOrder", paymentOrder);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ success: true, paymentOrder });
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
    async verifyPayment(req, res, next) {
        try {
            const paymentDetails = req.body.paymentData;
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatePayment = await this._paymentService.verifyPaymentService({
                paymentData: paymentDetails,
                plantId,
            });
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.PAYMENT,
                updatePayment,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchSubscriptionPayments(req, res, next) {
        try {
            const plantId = req.user?.id;
            console.log("plantId", plantId);
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const payments = await this._paymentService.fetchSubscriptionPayments(plantId);
            console.log("payments", payments);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ success: true, payments });
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
    async retrySubscriptionPayment(req, res, next) {
        try {
            const plantId = req.user?.id;
            const { planId, amount, subPaymtId } = req.body;
            console.log("body", req.body);
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const repaymentOrder = await this._paymentService.retrySubscriptionPayment({
                plantId,
                planId,
                amount,
                subPaymtId,
            });
            console.log("repaymentOrder", repaymentOrder);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.RETRY_ORDER_PAY_SUCCESS,
                repaymentOrder,
            });
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
    async updateRefundStatusPayment(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            console.log("body", req.body);
            const statusUpdateData = req.body.statusUpdateData;
            const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
            if (!allowedStatuses.includes(statusUpdateData.status)) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_REFUND_STATUS);
            }
            const statusUpdate = await this._paymentService.updateRefundStatusPayment({
                plantId,
                statusUpdateData,
            });
            console.log("statusUpdate", statusUpdate);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.REFUND_UPDTAE_SUCCESS,
                statusUpdate,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async refundPayment(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            console.log("body", req.body);
            const refundData = req.body;
            const updatedData = await this._paymentService.refundPayment(plantId, refundData);
            console.log("updatedData", updatedData);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.REFUND_SUCCESS,
                updatedData,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantPaymentService)),
    __metadata("design:paramtypes", [Object])
], PaymentController);

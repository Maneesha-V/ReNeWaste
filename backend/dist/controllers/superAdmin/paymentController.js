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
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async fetchPayments(req, res, next) {
        try {
            console.log(req.query);
            const DEFAULT_LIMIT = 5;
            const MAX_LIMIT = 50;
            const page = parseInt(req.query.page) || 1;
            let limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
            const search = req.query.search || "";
            const { total, paymentHis } = await this.paymentService.fetchPayments({
                page,
                limit,
                search,
            });
            console.log({ total, paymentHis });
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.PAYMENT_HISTORY,
                paymentHis,
                total,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateRefundStatusPayment(req, res, next) {
        try {
            console.log("params", req.body);
            const adminId = req.user?.id;
            if (!adminId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { subPayId, refundStatus } = req.body;
            if (!subPayId || !refundStatus) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
            if (!allowedStatuses.includes(refundStatus)) {
                res.status(400).json({ error: "Invalid refund status." });
                return;
            }
            const statusUpdate = await this.paymentService.updateRefundStatusPayment({
                adminId,
                subPayId,
                refundStatus,
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
            console.log("params", req.body);
            const adminId = req.user?.id;
            if (!adminId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { subPayId, refundStatus } = req.body;
            if (!subPayId || !refundStatus) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
            if (!allowedStatuses.includes(refundStatus)) {
                res.status(400).json({ error: "Invalid refund status." });
                return;
            }
            const statusUpdate = await this.paymentService.refundPayment({
                adminId,
                subPayId,
                refundStatus,
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
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SuperAdminPaymentService)),
    __metadata("design:paramtypes", [Object])
], PaymentController);

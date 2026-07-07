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
    async createPaymentOrder(req, res, next) {
        try {
            const userId = req.user?.id;
            const { amount, pickupReqId, method } = req.body.paymentData;
            console.log("user", userId);
            console.log("amount", amount, pickupReqId, method);
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const paymentOrder = await this._paymentService.createPaymentOrderService({
                amount,
                pickupReqId,
                userId,
                method
            });
            console.log("paymentOrder", paymentOrder);
            if (!paymentOrder) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.CREATE_PAYMENT_FAIL);
            }
            res.status(constantUtils_1.STATUS_CODES.CREATED).json(paymentOrder);
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async verifyPayment(req, res, next) {
        try {
            console.log("body", req.body);
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pickupReqId, amount, } = req.body.paymentData;
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatedPayment = await this._paymentService.verifyPaymentService({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                pickupReqId,
                amount,
                userId,
            });
            if (!updatedPayment) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.VERIFY_PAYMENT_FAIL);
            }
            console.log("updatedPayment", updatedPayment);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.PAYMENT_SUCCESSFUL,
                updatedPayment,
            });
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
    async getAllPayments(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const DEFAULT_LIMIT = 5;
            const MAX_LIMIT = 50;
            const page = parseInt(req.query.page) || 1;
            let limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
            const search = req.query.search || "";
            const filter = req.query.filter || "All";
            const paginationData = {
                page,
                limit,
                search,
                filter,
            };
            const { payments, total } = await this._paymentService.getAllPayments(userId, paginationData);
            if (!payments) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.FETCH_PAYMENT_FAIL);
            }
            console.log("payments", payments);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ payments, total });
        }
        catch (error) {
            next(error);
        }
    }
    async rePayment(req, res, next) {
        try {
            console.log("bbbb", req.body);
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { pickupReqId, amount } = req.body;
            const repaymentOrder = await this._paymentService.rePaymentService(userId, pickupReqId, amount);
            console.log("repaymentOrder", repaymentOrder);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: "Payment retry successful.",
                repaymentOrder,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyWalletPickupPayment(req, res, next) {
        try {
            console.log("body", req.body);
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const walletPickupPayResp = await this._paymentService.verifyWalletPickupPayment(userId, req.body.paymentData);
            console.log("walletPickupPayResp", walletPickupPayResp);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.WALLET_PAYMENT_SUCCESS,
                walletPickupPayResp,
            });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserPaymentService)),
    __metadata("design:paramtypes", [Object])
], PaymentController);

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
exports.PickupController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let PickupController = class PickupController {
    _pickupService;
    constructor(_pickupService) {
        this._pickupService = _pickupService;
    }
    async getPickupPlans(req, res, next) {
        try {
            console.log("query", req.query);
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
            const { pickups, total } = await this._pickupService.getPickupPlanService(userId, paginationData);
            console.log("pickups--", pickups);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ pickups, total });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async cancelPickupPlan(req, res, next) {
        try {
            const userId = req.user?.id;
            const { pickupReqId } = req.params;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const success = await this._pickupService.cancelPickupPlanService(pickupReqId);
            if (success) {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.USER.SUCCESS.PICKUP_CANCEL });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SERVER_ERROR)
                    .json({ message: constantUtils_1.MESSAGES.USER.ERROR.PICKUP_CANCEL });
            }
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
    async cancelPickupReason(req, res, next) {
        try {
            const { pickupReqId } = req.params;
            const { reason } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            console.log({ pickupReqId, userId, reason });
            const payment = await this._pickupService.cancelPickupReasonRequest({
                userId,
                pickupReqId,
                reason,
            });
            console.log("payment", payment);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.USER.SUCCESS.PICKUP_CANCEL,
                payment,
            });
        }
        catch (error) {
            console.error("error", error);
            next(error);
        }
    }
};
exports.PickupController = PickupController;
exports.PickupController = PickupController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserPickupService)),
    __metadata("design:paramtypes", [Object])
], PickupController);

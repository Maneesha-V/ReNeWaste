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
exports.DashboardController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let DashboardController = class DashboardController {
    _dashboardService;
    constructor(_dashboardService) {
        this._dashboardService = _dashboardService;
    }
    async fetchDriverDashboard(req, res, next) {
        try {
            const driverId = req.user?.id;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const dashboardData = await this._dashboardService.fetchDriverDashboard(driverId);
            console.log("dashboardData", dashboardData);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                dashboardData,
                success: true,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchWastePlantSupport(req, res, next) {
        try {
            const driverId = req.user?.id;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const supportData = await this._dashboardService.fetchWastePlantSupport(driverId);
            console.log("supportData", supportData);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                supportData,
                success: true,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async markAttendance(req, res, next) {
        try {
            const driverId = req.user?.id;
            console.log("body", req.body);
            const status = req.body.status;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const result = await this._dashboardService.markAttendance(driverId, status);
            console.log("result", result);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.MARK_ATTENDANCE,
                success: true,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchDriverEarnStats(req, res, next) {
        try {
            const driverId = req.user?.id;
            console.log("query", req.query);
            const filter = req.query.filter;
            const from = req.query.from;
            const to = req.query.to;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const earnRewardStats = await this._dashboardService.fetchDriverEarnStats({
                driverId,
                filter,
                from,
                to
            });
            console.log("earnRewardStats", earnRewardStats);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                earnRewardStats
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
};
exports.DashboardController = DashboardController;
exports.DashboardController = DashboardController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverDashboardService)),
    __metadata("design:paramtypes", [Object])
], DashboardController);

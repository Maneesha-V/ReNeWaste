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
    pickupService;
    constructor(pickupService) {
        this.pickupService = pickupService;
    }
    async getPickupRequests(req, res, next) {
        try {
            console.log("query", req.query);
            // const { wasteType } = req.query;
            const driverId = req.user?.id;
            const pickups = await this.pickupService.getPickupRequestService({
                // wasteType: wasteType as string,
                driverId: driverId,
            });
            console.log("pickups", pickups);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                pickups,
            });
        }
        catch (error) {
            console.error("Error fetching pickups:", error);
            next(error);
        }
    }
    async getPickupRequestById(req, res, next) {
        try {
            const { pickupReqId } = req.params;
            const driverId = req.user?.id;
            if (!pickupReqId || !driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_IDS);
            }
            const pickup = await this.pickupService.getPickupByIdForDriver(pickupReqId, driverId);
            console.log("tr-pickup", pickup);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                pickup,
            });
        }
        catch (error) {
            console.error("Error fetching pickups:", error);
            next(error);
        }
    }
    async updateAddressLatLng(req, res, next) {
        try {
            const { addressId } = req.params;
            const { latitude, longitude } = req.body;
            console.log("body", req.body);
            if (!latitude || !longitude) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.DRIVER.ERROR.LAT_LONG_REQUIRED);
            }
            const updatedAddress = await this.pickupService.updateAddressLatLngService(addressId, latitude, longitude);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ success: true, updatedAddress });
        }
        catch (error) {
            next(error);
        }
    }
    async updateTrackingStatus(req, res, next) {
        try {
            console.log(req.params);
            console.log(req.body);
            const { pickupReqId } = req.params;
            const { trackingStatus } = req.body;
            if (!trackingStatus) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.DRIVER.ERROR.STATUS_REQUIRED);
            }
            const updatedPickup = await this.pickupService.updateTrackingStatus(pickupReqId, trackingStatus);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ success: true, updatedPickup });
        }
        catch (error) {
            next(error);
        }
    }
    async markPickupCompleted(req, res, next) {
        try {
            console.log(req.params);
            const { pickupReqId } = req.params;
            if (!pickupReqId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const pickupStatus = await this.pickupService.markPickupCompletedService(pickupReqId);
            if (pickupStatus) {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                    success: true,
                    message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.MARK_PICKUP_COMPLETED,
                    pickupStatus,
                });
            }
            else {
                res.status(constantUtils_1.STATUS_CODES.FORBIDDEN).json({
                    success: false,
                    message: constantUtils_1.MESSAGES.DRIVER.ERROR.MARK_PICKUP_COMPLETED,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
};
exports.PickupController = PickupController;
exports.PickupController = PickupController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverPickupService)),
    __metadata("design:paramtypes", [Object])
], PickupController);

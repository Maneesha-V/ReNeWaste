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
    async getPickupRequests(req, res, next) {
        try {
            const { status, wasteType } = req.query;
            const plantId = req.user?.id;
            const pickups = await this._pickupService.getPickupRequestService({
                status: status,
                wasteType: wasteType,
                plantId: plantId,
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
    async approvePickup(req, res, next) {
        try {
            const { status, driverId, assignedTruckId } = req.body;
            const { pickupReqId } = req.params;
            const plantId = req.user?.id;
            if (!plantId || !status || !driverId || !assignedTruckId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const result = await this._pickupService.approvePickupService({
                plantId,
                pickupReqId,
                status,
                driverId,
                assignedTruckId,
            });
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.PICKUP_APPROVE,
                result,
            });
        }
        catch (error) {
            console.error("Error approving pickup:", error);
            next(error);
        }
    }
    async cancelPickup(req, res, next) {
        try {
            const { pickupReqId } = req.params;
            const { reason } = req.body;
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const result = await this._pickupService.cancelPickupRequest(plantId, pickupReqId, reason);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.PICKUP_CANCEL,
                result,
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async reschedulePickup(req, res, next) {
        try {
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { pickupReqId } = req.params;
            const rescheduleData = req.body;
            const updatedPickup = await this._pickupService.reschedulePickup(wasteplantId, pickupReqId, rescheduleData);
            console.log("updatedPickup", updatedPickup);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.PICKUP_RESCHEDULE,
                updatedPickup,
            });
        }
        catch (error) {
            console.error("Error rescheduling pickup:", error);
            next(error);
        }
    }
    async fetchDriversByPlace(req, res, next) {
        try {
            const location = req.query.location;
            const plantId = req.user?.id;
            console.log({ location, plantId });
            if (!location) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.LOCATION_REQUIRED);
            }
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const drivers = await this._pickupService.getAvailableDriverService(location, plantId);
            console.log("drivers", drivers);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                drivers,
            });
        }
        catch (error) {
            console.error("Error fetching pickups:", error);
            next(error);
        }
    }
};
exports.PickupController = PickupController;
exports.PickupController = PickupController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantPickupService)),
    __metadata("design:paramtypes", [Object])
], PickupController);

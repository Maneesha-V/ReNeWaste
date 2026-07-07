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
exports.TruckController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let TruckController = class TruckController {
    truckService;
    constructor(truckService) {
        this.truckService = truckService;
    }
    async fetchTruckForDriver(req, res, next) {
        try {
            const driverId = req.user?.id;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { wasteplantId } = req.params;
            const assignedTruck = await this.truckService.getTruckForDriver(driverId, wasteplantId);
            console.log("assignedTruck", assignedTruck);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.FETCH_ASSIGN_TRUCK,
                assignedTruck,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async requestTruckForDriver(req, res, next) {
        try {
            const driverId = req.user?.id;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const requestedDriver = await this.truckService.requestTruck(driverId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.TRUCK_REQ_SENT,
                requestedDriver,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markTruckReturn(req, res, next) {
        try {
            const { truckId, plantId } = req.body;
            const driverId = req.user?.id;
            if (!truckId || !plantId || !driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const updated = await this.truckService.markTruckReturnService({
                truckId,
                plantId,
                driverId,
            });
            if (updated) {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                    success: true,
                    message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.MARK_RETURN_TRUCK,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
};
exports.TruckController = TruckController;
exports.TruckController = TruckController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverTruckService)),
    __metadata("design:paramtypes", [Object])
], TruckController);

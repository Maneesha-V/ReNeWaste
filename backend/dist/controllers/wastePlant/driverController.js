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
exports.DriverController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let DriverController = class DriverController {
    _driverService;
    constructor(_driverService) {
        this._driverService = _driverService;
    }
    async getCreateDriver(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const data = await this._driverService.getTalukByPlantIdService(plantId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                data,
                success: true,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async addDriver(req, res, next) {
        try {
            const plantId = req.user?.id;
            console.log("plantId", plantId);
            console.log("body", req.body);
            const { files } = req;
            console.log("files", files);
            if (!files?.licenseFront || !files?.licenseBack) {
                res
                    .status(400)
                    .json({ error: "Both license front and back images are required" });
                return;
            }
            const licenseFrontPath = files.licenseFront[0].path;
            const licenseBackPath = files.licenseBack[0].path;
            const driverData = {
                ...req.body,
                licenseNumber: req.body.licenseNumber?.trim(),
                experience: Number(req.body.experience),
                licenseFront: licenseFrontPath,
                licenseBack: licenseBackPath,
                wasteplantId: new mongoose_1.default.Types.ObjectId(plantId),
            };
            console.log("driver", driverData);
            const newDriver = await this._driverService.addDriver(driverData);
            console.log("✅ Inserted Driver:", newDriver);
            if (newDriver) {
                res.status(constantUtils_1.STATUS_CODES.CREATED).json({
                    success: true,
                    message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.CREATE_DRIVER,
                });
            }
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchDrivers(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                res.status(404).json({ message: "plantId not found" });
                return;
            }
            console.log(req.query);
            const DEFAULT_LIMIT = 5;
            const MAX_LIMIT = 50;
            const page = parseInt(req.query.page) || 1;
            let limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
            const search = req.query.search || "";
            const { drivers, total } = await this._driverService.getAllDrivers(plantId, page, limit, search);
            console.log("drivers", drivers, total);
            res.status(200).json({
                success: true,
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.FETCH_DRIVER,
                drivers,
                total,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async getDriverById(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { driverId } = req.params;
            const driver = await this._driverService.getDriverByIdService(driverId, plantId);
            console.log("driver", driver);
            res.status(200).json({ data: driver });
        }
        catch (error) {
            console.error("Error fetching Driver:", error);
            next(error);
        }
    }
    async updateDriver(req, res, next) {
        try {
            console.log("body", req.body);
            const { driverId } = req.params;
            const { files } = req;
            if (!driverId) {
                res.status(400).json({ message: "Driver ID is required" });
                return;
            }
            const updatedData = req.body;
            if (files?.licenseFront) {
                updatedData.licenseFront = files.licenseFront[0].path;
            }
            if (files?.licenseBack) {
                updatedData.licenseBack = files.licenseBack[0].path;
            }
            if (updatedData.experience) {
                updatedData.experience = Number(updatedData.experience);
            }
            const updatedDriver = await this._driverService.updateDriverByIdService(driverId, updatedData);
            res.status(200).json({
                success: true,
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.UPDATE_DRIVER,
                data: updatedDriver,
            });
        }
        catch (error) {
            console.error("Error updating driver:", error);
            next(error);
        }
    }
    async deleteDriverById(req, res, next) {
        try {
            console.log("body", req.body);
            const { driverId } = req.params;
            const updatedDriver = await this._driverService.deleteDriverByIdService(driverId);
            if (!updatedDriver) {
                res.status(404).json({ message: "Driver not found" });
                return;
            }
            res.status(200).json({
                updatedDriver,
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.DELETE_DRIVER,
            });
        }
        catch (error) {
            console.error("Error in deleting driver:", error);
            next(error);
        }
    }
};
exports.DriverController = DriverController;
exports.DriverController = DriverController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantDriverService)),
    __metadata("design:paramtypes", [Object])
], DriverController);

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
exports.ProfileController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfile(req, res, next) {
        try {
            const driverId = req.user?.id;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const driver = await this.profileService.getDriverProfile(driverId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ driver });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const driverId = req.user?.id;
            const updatedData = req.body;
            if (!driverId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatedDriver = await this.profileService.updateDriverProfile(driverId, updatedData);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                updatedDriver,
                message: constantUtils_1.MESSAGES.DRIVER.SUCCESS.UPDATE_DRIVER,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getDriversByWastePlant(req, res, next) {
        try {
            const wastePlantId = req.query.wastePlantId;
            if (!wastePlantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const drivers = await this.profileService.fetchDriversService(wastePlantId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ drivers });
        }
        catch (error) {
            console.error("Error fetching drivers:", error);
            next(error);
        }
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverProfileService)),
    __metadata("design:paramtypes", [Object])
], ProfileController);

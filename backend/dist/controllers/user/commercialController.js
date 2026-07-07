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
exports.CommercialController = void 0;
const moment_1 = __importDefault(require("moment"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let CommercialController = class CommercialController {
    commercialService;
    constructor(commercialService) {
        this.commercialService = commercialService;
    }
    async getCommercial(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const user = await this.commercialService.getCommercialService(userId);
            console.log("user", user);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ user, message: constantUtils_1.MESSAGES.USER.SUCCESS.COMMERCIAL_PICKUP });
        }
        catch (error) {
            next(error);
        }
    }
    async checkServiceAvailable(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { service, wasteplantId } = req.body;
            const success = await this.commercialService.availableWasteService(service, wasteplantId);
            if (success) {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ available: true });
            }
            else {
                res.status(constantUtils_1.STATUS_CODES.SERVER_ERROR).json({ available: false });
            }
        }
        catch (error) {
            console.error("Error in checking service availability:", error);
            next(error);
        }
    }
    async updateCommercialPickup(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            console.log(req.body);
            const updatedData = req.body;
            const pickupDateString = updatedData.pickupDate;
            const formattedDate = (0, moment_1.default)(pickupDateString, "MM-DD-YYYY", true).toDate();
            if (isNaN(formattedDate.getTime())) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.USER.ERROR.PICKUP_DATE);
            }
            updatedData.pickupDate = formattedDate;
            const success = await this.commercialService.updateCommercialPickupService(userId, updatedData);
            if (success) {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.USER.SUCCESS.PICKUP_CREATED });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SERVER_ERROR)
                    .json({ message: constantUtils_1.MESSAGES.USER.ERROR.PICKUP_CREATED });
            }
        }
        catch (error) {
            console.error("Error in updation:", error);
            next(error);
        }
    }
};
exports.CommercialController = CommercialController;
exports.CommercialController = CommercialController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.CommercialService)),
    __metadata("design:paramtypes", [Object])
], CommercialController);

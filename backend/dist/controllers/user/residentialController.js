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
exports.ResidentialController = void 0;
const moment_1 = __importDefault(require("moment"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let ResidentialController = class ResidentialController {
    residentialService;
    constructor(residentialService) {
        this.residentialService = residentialService;
    }
    async getResidential(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const user = await this.residentialService.getResidentialService(userId);
            console.log("user", user);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ user, message: constantUtils_1.MESSAGES.USER.SUCCESS.RESIDENTIAL_PICKUP });
        }
        catch (error) {
            next(error);
        }
    }
    async updateResidentialPickup(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatedData = req.body;
            console.log("updatedData", updatedData);
            const pickupDateString = updatedData.pickupDate;
            const formattedDate = (0, moment_1.default)(pickupDateString, "MM-DD-YYYY", true).toDate();
            if (isNaN(formattedDate.getTime())) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.USER.ERROR.PICKUP_DATE);
            }
            updatedData.pickupDate = formattedDate;
            const success = await this.residentialService.updateResidentialPickupService(userId, updatedData);
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
exports.ResidentialController = ResidentialController;
exports.ResidentialController = ResidentialController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.ResidentialService)),
    __metadata("design:paramtypes", [Object])
], ResidentialController);

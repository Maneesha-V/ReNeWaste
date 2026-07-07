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
exports.NotificationController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let NotificationController = class NotificationController {
    _notificationService;
    constructor(_notificationService) {
        this._notificationService = _notificationService;
    }
    async fetchNotifications(req, res, next) {
        try {
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const notifications = await this._notificationService.getNotifications(wasteplantId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ notifications: notifications });
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
            next(error);
        }
    }
    async markReadNotification(req, res, next) {
        try {
            const { notifId } = req.params;
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatedNotification = await this._notificationService.markNotificationAsRead(notifId, plantId);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ updatedNotification: updatedNotification });
        }
        catch (error) {
            next(error);
        }
    }
    async saveWasteMeasurement(req, res, next) {
        try {
            console.log("body", req.body);
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { notificationId, weight } = req.body;
            if (!notificationId || !weight) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const result = await this._notificationService.saveWasteMeasurement({
                wasteplantId,
                weight,
                notificationId,
            });
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.WASTE_MWASURED,
                data: result,
            });
        }
        catch (error) {
            console.error("Error in waste measurement:", error);
            next(error);
        }
    }
};
exports.NotificationController = NotificationController;
exports.NotificationController = NotificationController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantNotificationService)),
    __metadata("design:paramtypes", [Object])
], NotificationController);

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
exports.DropSpotController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
(0, inversify_1.injectable)();
let DropSpotController = class DropSpotController {
    dropSpotService;
    constructor(dropSpotService) {
        this.dropSpotService = dropSpotService;
    }
    async fetchAllNearDropSpots(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const dropspots = await this.dropSpotService.getAllNearDropSpots(userId);
            console.log("dropspots", dropspots);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.USER.SUCCESS.FETCH_DROPSPOTS,
                dropspots,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
};
exports.DropSpotController = DropSpotController;
exports.DropSpotController = DropSpotController = __decorate([
    __param(0, (0, inversify_1.inject)(types_1.default.UserDropSpotService)),
    __metadata("design:paramtypes", [Object])
], DropSpotController);

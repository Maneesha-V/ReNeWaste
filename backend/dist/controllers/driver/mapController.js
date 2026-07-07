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
exports.MapController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let MapController = class MapController {
    mapService;
    constructor(mapService) {
        this.mapService = mapService;
    }
    async getETA(req, res, next) {
        try {
            const { origin, destination, pickupReqId, addressId } = req.query;
            console.log("query", req.query);
            if (!origin || !destination || !pickupReqId || !addressId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const eta = await this.mapService.getAndSaveETA(origin, destination, pickupReqId, addressId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ eta });
        }
        catch (error) {
            console.error("Google Maps ETA error:", error);
            next(error);
        }
    }
};
exports.MapController = MapController;
exports.MapController = MapController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverMapService)),
    __metadata("design:paramtypes", [Object])
], MapController);

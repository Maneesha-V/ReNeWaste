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
let DropSpotController = class DropSpotController {
    dropspotService;
    constructor(dropspotService) {
        this.dropspotService = dropspotService;
    }
    async createDropSpot(req, res, next) {
        try {
            console.log(req.body);
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const payloadWithPlant = {
                ...req.body,
                wasteplantId,
            };
            const success = await this.dropspotService.createDropSpotService(payloadWithPlant);
            if (success) {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                    success: true,
                    message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.DROP_SPOT_CREATE,
                });
            }
            else {
                res.status(constantUtils_1.STATUS_CODES.SERVER_ERROR).json({
                    success: false,
                    message: constantUtils_1.MESSAGES.WASTEPLANT.ERROR.DROP_SPOT_CREATE,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async fetchDropSpots(req, res, next) {
        try {
            console.log(req.query);
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || "";
            const { dropspots, total } = await this.dropspotService.getAllDropSpots(wasteplantId, page, limit, search);
            console.log("dropspots", dropspots);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH_DROP_SPOT,
                dropspots,
                total,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchDropSpotById(req, res, next) {
        try {
            const { dropSpotId } = req.params;
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const selectedDropSpot = await this.dropspotService.getDropSpotByIdService(dropSpotId, wasteplantId);
            console.log("selectedDropSpot", selectedDropSpot);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json(selectedDropSpot);
        }
        catch (error) {
            console.error("Error fetching truck:", error);
            next(error);
        }
    }
    async deleteDropSpotById(req, res, next) {
        try {
            const { dropSpotId } = req.params;
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const dropspot = await this.dropspotService.deleteDropSpotByIdService(dropSpotId, wasteplantId);
            console.log("result-delete", dropspot);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.DROP_SPOT_DELETE,
                dropspot,
            });
        }
        catch (error) {
            console.error("Error in deleting dropspot:", error);
            next(error);
        }
    }
    async updateDropSpot(req, res, next) {
        try {
            const { dropSpotId } = req.params;
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updateData = req.body;
            const updatedDropSpot = await this.dropspotService.updateDropSpotService(wasteplantId, dropSpotId, updateData);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                updatedDropSpot,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.DROP_SPOT_UPDATE,
            });
        }
        catch (error) {
            console.error("Error updating dropspot:", error);
            next(error);
        }
    }
};
exports.DropSpotController = DropSpotController;
exports.DropSpotController = DropSpotController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantDropSpotService)),
    __metadata("design:paramtypes", [Object])
], DropSpotController);

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
const mongoose_1 = __importDefault(require("mongoose"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let TruckController = class TruckController {
    truckService;
    constructor(truckService) {
        this.truckService = truckService;
    }
    async addTruck(req, res, next) {
        try {
            const plantId = req.user?.id;
            console.log("plantId", plantId);
            console.log("body", req.body);
            const truckData = {
                ...req.body,
                capacity: Number(req.body.capacity),
                tareWeight: Number(req.body.tareWeight),
                wasteplantId: new mongoose_1.default.Types.ObjectId(plantId),
            };
            const newTruck = await this.truckService.addTruck(truckData);
            console.log("✅ Inserted Truck:", newTruck);
            if (newTruck) {
                res.status(constantUtils_1.STATUS_CODES.CREATED).json({
                    success: true,
                    message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.CRETAE_TRUCK,
                });
            }
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchTrucks(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || "";
            const { trucks, total } = await this.truckService.getAllTrucks(plantId, page, limit, search);
            console.log("trucks", trucks);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK,
                trucks,
                total,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async fetchAvailableTrucks(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const { driverId } = req.query;
            if (typeof driverId !== "string") {
                res.status(400).json({ message: "Invalid or missing driverId" });
                return;
            }
            const trucks = await this.truckService.getAvailableTrucksService(driverId, plantId);
            console.log("trucks", trucks);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK,
                trucks,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async getTruckById(req, res, next) {
        try {
            const { truckId } = req.params;
            const truck = await this.truckService.getTruckByIdService(truckId);
            if (!truck) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ truck });
        }
        catch (error) {
            console.error("Error fetching truck:", error);
            next(error);
        }
    }
    async updateTruck(req, res, next) {
        try {
            const { truckId } = req.params;
            if (!truckId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const updatedData = req.body;
            if (updatedData.capacity) {
                updatedData.capacity = Number(updatedData.capacity);
            }
            const updatedTruck = await this.truckService.updateTruckByIdService(truckId, updatedData);
            if (!updatedTruck) {
                res.status(404).json({ message: "Truck not found" });
                return;
            }
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.TRUCK_UPDATE,
                updatedTruck,
            });
        }
        catch (error) {
            console.error("Error updating truck:", error);
            next(error);
        }
    }
    async deleteTruckById(req, res, next) {
        try {
            const { truckId } = req.params;
            if (!truckId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const updatedTruck = await this.truckService.deleteTruckByIdService(truckId);
            console.log("updatedTruck", updatedTruck);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                updatedTruck,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.TRUCK_DELETE,
            });
        }
        catch (error) {
            console.error("Error in deleting truck:", error);
            next(error);
        }
    }
    async getAvailableTruckReqsts(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const pendingTruckReqsts = await this.truckService.pendingTruckReqsts(plantId);
            console.log("pendingTruckReqsts", pendingTruckReqsts);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK_REQ,
                pendingTruckReqsts,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async getTrucksForDriver(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const availableTrucks = await this.truckService.availableTrucksForDriver(plantId);
            console.log("availableTrucks", availableTrucks);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK,
                availableTrucks,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async assignTruckToDriver(req, res, next) {
        try {
            const plantId = req.user?.id;
            const { driverId, truckId, prevTruckId } = req.body;
            console.log("plantId", plantId);
            console.log(req.body);
            if (!plantId || !driverId || !truckId || !prevTruckId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const updatedRequests = await this.truckService.assignTruckToDriverService(plantId, driverId, truckId, prevTruckId);
            console.log("updatedRequest", updatedRequests);
            res.status(200).json({
                updatedRequests,
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.ASSIGN_TRUCK_DRIVER,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
};
exports.TruckController = TruckController;
exports.TruckController = TruckController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantTruckService)),
    __metadata("design:paramtypes", [Object])
], TruckController);

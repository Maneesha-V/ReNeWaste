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
exports.WasteCollectionRepository = void 0;
const inversify_1 = require("inversify");
const wasteCollectionModel_1 = require("../../models/wasteCollection/wasteCollectionModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const types_1 = __importDefault(require("../../config/inversify/types"));
const mongoose_1 = __importDefault(require("mongoose"));
let WasteCollectionRepository = class WasteCollectionRepository extends baseRepository_1.default {
    driverRepository;
    truckRepository;
    notificationRepository;
    constructor(driverRepository, truckRepository, notificationRepository) {
        super(wasteCollectionModel_1.WasteCollectionModel);
        this.driverRepository = driverRepository;
        this.truckRepository = truckRepository;
        this.notificationRepository = notificationRepository;
    }
    async createWasteMeasurement(data) {
        const notification = await this.notificationRepository.getNotificationById(data.notificationId);
        if (!notification) {
            throw new Error("Notification not found.");
        }
        if (notification.receiverId.toString() !== data.wasteplantId) {
            throw new Error("Wasteplant mismatch.");
        }
        const messageParts = notification?.message.split(" ");
        const vehicleNumber = messageParts[1];
        const driverName = messageParts[messageParts.length - 1];
        notification.isMeasured = true;
        await notification.save();
        const driver = await this.driverRepository.findDriverByName(driverName);
        const truck = await this.truckRepository.findTruckByVehicle(vehicleNumber);
        if (!driver || !truck) {
            throw new Error("Driver or Truck not found.");
        }
        console.log({ driver, truck });
        const collectedWeight = data.weight - truck.tareWeight;
        const wasteType = driver.category;
        await this.model.create({
            driverId: driver._id,
            truckId: truck._id,
            wasteplantId: data.wasteplantId,
            measuredWeight: data.weight,
            collectedWeight: collectedWeight,
            wasteType: wasteType,
            returnedAt: notification.createdAt,
        });
        return { notificationId: notification._id.toString() };
    }
    async totalWasteAmount(plantId) {
        const wasteData = await this.model.aggregate([
            {
                $match: {
                    wasteplantId: new mongoose_1.default.Types.ObjectId(plantId),
                },
            },
            {
                $group: {
                    _id: "$wasteType",
                    totalCollectedWeight: { $sum: "$collectedWeight" },
                },
            },
        ]);
        let totalResidWaste = 0;
        let totalCommWaste = 0;
        for (const item of wasteData) {
            if (item._id === "Residential") {
                totalResidWaste = item.totalCollectedWeight;
            }
            else if (item._id === "Commercial") {
                totalCommWaste = item.totalCollectedWeight;
            }
        }
        return {
            totalResidWaste,
            totalCommWaste,
        };
    }
    async fetchWasteCollectionReportsByPlantId(plantId) {
        const collectionReports = await this.model
            .find({
            wasteplantId: plantId,
        })
            .populate({
            path: "driverId",
            select: "name",
        })
            .populate({
            path: "truckId",
            select: "name",
        });
        return collectionReports;
    }
    async filterWasteCollectionReportsByPlantId(data) {
        const fromDate = new Date(`${data.from}T00:00:00.000Z`);
        const toDate = new Date(`${data.to}T23:59:59.999Z`);
        const filterReports = await this.model
            .find({
            wasteplantId: data.plantId,
            createdAt: { $gte: fromDate, $lte: toDate },
        })
            .populate({
            path: "driverId",
            select: "name",
        })
            .populate({
            path: "truckId",
            select: "name",
        });
        return filterReports;
    }
    async getTotalWasteCollected() {
        const result = await this.model.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$collectedWeight" },
                },
            },
        ]);
        return result[0]?.total || 0;
    }
};
exports.WasteCollectionRepository = WasteCollectionRepository;
exports.WasteCollectionRepository = WasteCollectionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.NotificationRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], WasteCollectionRepository);

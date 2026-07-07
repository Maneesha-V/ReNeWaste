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
exports.DriverRepository = void 0;
const mongoose_1 = require("mongoose");
const driverModel_1 = require("../../models/driver/driverModel");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const DriverMapper_1 = require("../../mappers/DriverMapper");
let DriverRepository = class DriverRepository extends baseRepository_1.default {
    getTruckRepo;
    notificationRepository;
    constructor(getTruckRepo, notificationRepository) {
        super(driverModel_1.DriverModel);
        this.getTruckRepo = getTruckRepo;
        this.notificationRepository = notificationRepository;
    }
    async createDriver(data) {
        const driver = new this.model(data);
        console.log("driver", driver);
        return await driver.save();
    }
    async findDriverByEmail(email) {
        return await this.model.findOne({ email });
    }
    async findDriverByName(name) {
        return await this.model.findOne({ name });
    }
    async findDriverByLicense(licenseNumber) {
        return await this.model.findOne({ licenseNumber });
    }
    async getAllDrivers(plantId, page, limit, search) {
        const searchRegex = new RegExp(search, "i");
        const query = {
            wasteplantId: plantId,
            isDeleted: false,
            $or: [
                { name: { $regex: searchRegex } },
                { licenseNumber: { $regex: searchRegex } },
                { contact: { $regex: searchRegex } },
            ],
        };
        if (!isNaN(Number(search))) {
            query.$or.push({ experience: Number(search) });
        }
        const skip = (page - 1) * limit;
        const drivers = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.model.countDocuments(query);
        return {
            drivers: DriverMapper_1.DriverMapper.mapDriversDTO(drivers),
            total,
        };
    }
    async updateDriverPassword(email, hashedPassword) {
        await this.model.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true, runValidators: false });
    }
    async getDriverById(driverId) {
        return await this.model.findById(driverId);
    }
    async updateDriverById(driverId, data) {
        return await this.model.findByIdAndUpdate(driverId, data, { new: true });
    }
    async deleteDriverById(driverId) {
        const updatedDriver = await this.model.findByIdAndUpdate(driverId, { isDeleted: true, status: "Inactive" }, { new: true });
        if (!updatedDriver) {
            throw new Error("Driver not found.");
        }
        return updatedDriver;
    }
    async fetchDriversByPlantId(wastePlantId) {
        const objectId = new mongoose_1.Types.ObjectId(wastePlantId);
        return await this.model
            .find({
            wasteplantId: objectId,
            status: "Active",
        })
            .sort({ name: 1 });
    }
    async updateDriverTruck(driverId, assignedTruckId) {
        const objectIdDriver = new mongoose_1.Types.ObjectId(driverId);
        const objectIdTruck = new mongoose_1.Types.ObjectId(assignedTruckId);
        await this.getTruckRepo().updateAssignedDriver(assignedTruckId, objectIdDriver);
        return await this.model.findByIdAndUpdate(objectIdDriver, {
            $set: {
                assignedTruckId: objectIdTruck,
            },
        }, { new: true });
    }
    async updateDriverAssignedZone(driverId, assignedZone) {
        const objectId = new mongoose_1.Types.ObjectId(driverId);
        return await this.model.findByIdAndUpdate(objectId, {
            $set: {
                assignedZone: assignedZone,
            },
        }, { new: true });
    }
    async getDriversByLocation(location, plantId) {
        const objectId = new mongoose_1.Types.ObjectId(plantId);
        return await this.model
            .find({
            wasteplantId: objectId,
            assignedZone: location,
        })
            .sort({ name: 1 });
    }
    async updateDriverByPlantAndId(driverId, plantId, updateData) {
        return await this.model.findOneAndUpdate({
            _id: driverId,
            wasteplantId: plantId,
        }, {
            $set: updateData,
        }, {
            new: true,
        });
    }
    async countAll() {
        return await this.model.countDocuments();
    }
    async markTruckAsReturned(truckId, plantId, driverId) {
        const driver = await this.model.findById(driverId);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        if (!driver.wasteplantId || driver.wasteplantId.toString() !== plantId) {
            throw new Error("Unauthorized plant.");
        }
        driver.assignedTruckId = null;
        await driver.save();
        const truck = await this.getTruckRepo().markTruckAsReturned(driverId, truckId, plantId);
        const message = `Truck ${truck?.vehicleNumber} returned by driver ${driver.name}`;
        const notification = await this.notificationRepository.createNotification({
            receiverId: plantId,
            receiverType: "wasteplant",
            senderId: driverId,
            senderType: "driver",
            message,
            type: "truck_returned",
        });
        console.log("notification", notification);
        const io = globalThis.io;
        if (io) {
            io.to(`${plantId}`).emit("newNotification", notification);
        }
        return { driver, truck };
    }
    async fetchAllDriversByPlantId(wastePlantId) {
        const driverCounts = await this.model.aggregate([
            {
                $match: {
                    wasteplantId: new mongoose_1.Types.ObjectId(wastePlantId),
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: "$status",
                    totalCount: { $sum: 1 },
                },
            },
        ]);
        let active = 0;
        let inactive = 0;
        let suspended = 0;
        for (const record of driverCounts) {
            if (record._id === "Active") {
                active = record.totalCount;
            }
            else if (record._id === "Inactive") {
                inactive = record.totalCount;
            }
            else if (record._id === "Suspended") {
                suspended = record.totalCount;
            }
        }
        return { active, inactive, suspended };
    }
    async getTotalDrivers() {
        return await this.model.countDocuments();
    }
};
exports.DriverRepository = DriverRepository;
exports.DriverRepository = DriverRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.TruckRepositoryFactory)),
    __param(1, (0, inversify_1.inject)(types_1.default.NotificationRepository)),
    __metadata("design:paramtypes", [Function, Object])
], DriverRepository);

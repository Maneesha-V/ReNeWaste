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
exports.TruckRepository = void 0;
const truckModel_1 = require("../../models/truck/truckModel");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const mongoose_1 = require("mongoose");
let TruckRepository = class TruckRepository extends baseRepository_1.default {
    getDriverRepo;
    constructor(getDriverRepo) {
        super(truckModel_1.TruckModel);
        this.getDriverRepo = getDriverRepo;
    }
    async findTruckByVehicle(vehicleNumber) {
        return await this.model.findOne({ vehicleNumber });
    }
    async createTruck(data) {
        const truck = new this.model(data);
        console.log("db-truck", truck);
        return await truck.save();
    }
    async getAllTrucks(plantId, page, limit, search) {
        console.log("search", search);
        const searchRegex = new RegExp(search, "i");
        const query = {
            wasteplantId: plantId,
            isDeleted: false,
            $or: [
                { name: { $regex: searchRegex } },
                { vehicleNumber: { $regex: searchRegex } },
                { status: { $regex: searchRegex } },
            ],
        };
        if (!isNaN(Number(search))) {
            query.$or.push({ capacity: Number(search) });
        }
        const skip = (page - 1) * limit;
        const trucks = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.model.countDocuments(query);
        return { trucks, total };
    }
    async getAvailableTrucks(driverId, plantId) {
        const existingTruck = await this.model
            .findOne({
            assignedDriver: driverId,
            wasteplantId: plantId,
        })
            .populate("wasteplantId");
        if (existingTruck) {
            return [existingTruck];
        }
        return await this.model
            .find({ assignedDriver: null, wasteplantId: plantId })
            .populate("wasteplantId");
    }
    async getAssignedAvailableTrucks(driverId, plantId) {
        const existingTruck = await this.model
            .findOne({
            assignedDriver: driverId,
            wasteplantId: plantId,
        })
            .populate("wasteplantId");
        if (existingTruck) {
            return [existingTruck];
        }
        return null;
    }
    async getTruckById(truckId) {
        return await this.model.findById(truckId);
    }
    async updateTruckById(truckId, data) {
        return await this.model.findByIdAndUpdate(truckId, data, { new: true });
    }
    async deleteTruckById(truckId) {
        const updatedTruck = await this.model.findByIdAndUpdate(truckId, { isDeleted: true, status: "Inactive" }, { new: true });
        if (!updatedTruck) {
            throw new Error("Truck not found.");
        }
        return updatedTruck;
    }
    async reqTruckToWastePlant(driverId) {
        return await this.getDriverRepo().updateDriverById(driverId, {
            hasRequestedTruck: true,
        });
    }
    async getMaintainanceTrucks(plantId) {
        const trucks = await this.model
            .find({
            wasteplantId: plantId,
            status: "Maintenance",
        })
            .populate("assignedDriver");
        return trucks.filter((truck) => truck.assignedDriver !== null);
    }
    async activeAvailableTrucks(plantId) {
        return await this.model.find({
            wasteplantId: plantId,
            status: "Active",
            assignedDriver: null,
        });
    }
    async assignTruckToDriver(plantId, driverId, truckId, prevTruckId) {
        const updatedDriver = await this.getDriverRepo().updateDriverByPlantAndId(driverId, plantId, {
            assignedTruckId: new mongoose_1.Types.ObjectId(truckId),
            hasRequestedTruck: false,
        });
        const updatedTruck = await this.model.findOneAndUpdate({ _id: truckId }, {
            $set: {
                assignedDriver: driverId,
            },
        }, { new: true });
        if (prevTruckId && prevTruckId !== truckId) {
            await this.model.findOneAndUpdate({ _id: prevTruckId }, {
                $set: {
                    assignedDriver: null,
                },
            });
        }
        return await this.getMaintainanceTrucks(plantId);
    }
    async updateAssignedDriver(truckId, driverId) {
        const objectIdTruck = new mongoose_1.Types.ObjectId(truckId);
        const objectIdDriver = typeof driverId === "string" ? new mongoose_1.Types.ObjectId(driverId) : driverId;
        await this.model.findByIdAndUpdate(objectIdTruck, {
            $set: {
                assignedDriver: objectIdDriver,
                isReturned: false,
            },
        });
    }
    async countAll() {
        return await this.model.countDocuments();
    }
    async markTruckAsReturned(driverId, truckId, plantId) {
        const truck = await this.model.findOneAndUpdate({ _id: truckId, assignedDriver: driverId, wasteplantId: plantId }, {
            $set: { isReturned: true, assignedDriver: null },
        }, { new: true });
        if (!truck) {
            throw new Error("Truck not found or not assigned to this driver");
        }
        return truck;
    }
    async findTruckByName(name) {
        return await this.model.findOne({ name });
    }
    async fetchAllTrucksByPlantId(plantId) {
        const truckCounts = await this.model.aggregate([
            {
                $match: {
                    wasteplantId: new mongoose_1.Types.ObjectId(plantId),
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
        let maintenance = 0;
        for (const record of truckCounts) {
            if (record._id === "Active") {
                active = record.totalCount;
            }
            else if (record._id === "Inactive") {
                inactive = record.totalCount;
            }
            else if (record._id === "Maintenance") {
                maintenance = record.totalCount;
            }
        }
        return { active, inactive, maintenance };
    }
    async getTotalTrucks() {
        return await this.model.countDocuments();
    }
};
exports.TruckRepository = TruckRepository;
exports.TruckRepository = TruckRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __metadata("design:paramtypes", [Function])
], TruckRepository);

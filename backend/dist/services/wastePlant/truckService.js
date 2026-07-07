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
exports.TruckService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const TruckMapper_1 = require("../../mappers/TruckMapper");
let TruckService = class TruckService {
    truckRepository;
    wasteplantRepository;
    subscriptionplanRepository;
    constructor(truckRepository, wasteplantRepository, subscriptionplanRepository) {
        this.truckRepository = truckRepository;
        this.wasteplantRepository = wasteplantRepository;
        this.subscriptionplanRepository = subscriptionplanRepository;
    }
    async addTruck(data) {
        const trucksCount = await this.truckRepository.fetchAllTrucksByPlantId(data.wasteplantId.toString());
        const totalTruckCount = trucksCount.active + trucksCount.inactive + trucksCount.maintenance;
        const plant = await this.wasteplantRepository.getWastePlantById(data.wasteplantId.toString());
        if (!plant) {
            throw new Error("Plant not found.");
        }
        if (plant.status === "Active") {
            const purchasedPlan = await this.subscriptionplanRepository.checkPlanNameExist(plant.subscriptionPlan);
            if (!purchasedPlan) {
                throw new Error("Subscription plan not found.");
            }
            if (totalTruckCount >= purchasedPlan?.truckLimit) {
                throw new Error(`You can't add new truck bcoz your plan truck limit is ${purchasedPlan?.truckLimit}.`);
            }
        }
        const existingVehicleNo = await this.truckRepository.findTruckByVehicle(data.vehicleNumber);
        if (existingVehicleNo) {
            throw new Error("Vehicle number already exists");
        }
        const newData = {
            ...data,
        };
        const created = await this.truckRepository.createTruck(newData);
        if (!created) {
            throw new Error("Can't create truck.");
        }
        return true;
    }
    async getAllTrucks(plantId, page, limit, search) {
        const { trucks, total } = await this.truckRepository.getAllTrucks(plantId, page, limit, search);
        return {
            trucks: TruckMapper_1.TruckMapper.mapTrucksDTO(trucks),
            total,
        };
    }
    async getAvailableTrucksService(driverId, plantId) {
        const trucks = await this.truckRepository.getAvailableTrucks(driverId, plantId);
        console.log("trucks", trucks);
        return TruckMapper_1.TruckMapper.mapAvailableTrucksDTO(trucks);
    }
    async getTruckByIdService(truckId) {
        const truck = await this.truckRepository.getTruckById(truckId);
        if (!truck) {
            throw new Error("Truck not found.");
        }
        return TruckMapper_1.TruckMapper.mapTruckDTO(truck);
    }
    async updateTruckByIdService(truckId, data) {
        const truck = await this.truckRepository.updateTruckById(truckId, data);
        if (!truck) {
            throw new Error("Truck not found.");
        }
        return TruckMapper_1.TruckMapper.mapTruckDTO(truck);
    }
    async deleteTruckByIdService(truckId) {
        const truck = await this.truckRepository.deleteTruckById(truckId);
        if (!truck) {
            throw new Error("Truck not found.");
        }
        return TruckMapper_1.TruckMapper.mapTruckDTO(truck);
    }
    async pendingTruckReqsts(plantId) {
        const trucks = await this.truckRepository.getMaintainanceTrucks(plantId);
        return TruckMapper_1.TruckMapper.mapTrucksDTO(trucks);
    }
    async availableTrucksForDriver(plantId) {
        const trucks = await this.truckRepository.activeAvailableTrucks(plantId);
        return TruckMapper_1.TruckMapper.mapTrucksDTO(trucks);
    }
    async assignTruckToDriverService(plantId, driverId, truckId, prevTruckId) {
        const truck = await this.truckRepository.getTruckById(truckId);
        if (!truck || truck.status !== "Active") {
            throw new Error("Selected truck is not available");
        }
        const updatedRequest = await this.truckRepository.assignTruckToDriver(plantId, driverId, truckId, prevTruckId);
        return TruckMapper_1.TruckMapper.mapTrucksDTO(updatedRequest);
    }
};
exports.TruckService = TruckService;
exports.TruckService = TruckService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TruckService);

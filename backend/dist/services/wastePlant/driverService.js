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
exports.DriverService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const DriverMapper_1 = require("../../mappers/DriverMapper");
let DriverService = class DriverService {
    driverRepository;
    wastePlantRepository;
    subscriptionplanRepository;
    constructor(driverRepository, wastePlantRepository, subscriptionplanRepository) {
        this.driverRepository = driverRepository;
        this.wastePlantRepository = wastePlantRepository;
        this.subscriptionplanRepository = subscriptionplanRepository;
    }
    async addDriver(data) {
        const driversCount = await this.driverRepository.fetchAllDriversByPlantId(data.wasteplantId.toString());
        const totalDriverCount = driversCount.active + driversCount.inactive + driversCount.suspended;
        const plant = await this.wastePlantRepository.getWastePlantById(data.wasteplantId.toString());
        if (!plant) {
            throw new Error("Plant not found.");
        }
        if (plant.status === "Active") {
            const purchasedPlan = await this.subscriptionplanRepository.checkPlanNameExist(plant.subscriptionPlan);
            if (!purchasedPlan) {
                throw new Error("Subscription plan not found.");
            }
            if (totalDriverCount >= purchasedPlan?.driverLimit) {
                throw new Error(`You can't add new driver bcoz your plan driver limit is ${purchasedPlan?.driverLimit}.`);
            }
        }
        const existingEmail = await this.driverRepository.findDriverByEmail(data.email);
        if (existingEmail) {
            throw new Error("Email already exists");
        }
        const existingName = await this.driverRepository.findDriverByName(data.name);
        if (existingName) {
            throw new Error("Name already exists");
        }
        const existingLicenseNo = await this.driverRepository.findDriverByLicense(data.licenseNumber);
        if (existingLicenseNo) {
            throw new Error("License number already exists");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        const newData = {
            ...data,
            password: hashedPassword,
        };
        const created = await this.driverRepository.createDriver(newData);
        if (!created) {
            throw new Error("Can't create driver.");
        }
        return true;
    }
    async getAllDrivers(plantId, page, limit, search) {
        return await this.driverRepository.getAllDrivers(plantId, page, limit, search);
    }
    async getDriverByIdService(driverId, plantId) {
        const driver = await this.driverRepository.getDriverById(driverId);
        if (!driver)
            throw new Error("Driver not found");
        const { taluk } = await this.getTalukByPlantIdService(plantId);
        return {
            driver: DriverMapper_1.DriverMapper.mapDriverDTO(driver),
            taluk,
        };
    }
    async updateDriverByIdService(driverId, data) {
        const driver = await this.driverRepository.updateDriverById(driverId, data);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        return DriverMapper_1.DriverMapper.mapDriverDTO(driver);
    }
    async deleteDriverByIdService(driverId) {
        const updated = await this.driverRepository.deleteDriverById(driverId);
        return DriverMapper_1.DriverMapper.mapDriverDTO(updated);
    }
    async getTalukByPlantIdService(plantId) {
        const res = await this.wastePlantRepository.getWastePlantById(plantId);
        if (!res?.taluk)
            throw new Error("Taluk not found in plant record");
        return { taluk: res.taluk };
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], DriverService);

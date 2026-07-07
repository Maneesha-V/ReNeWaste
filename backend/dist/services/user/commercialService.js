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
exports.CommercialService = void 0;
const mongoose_1 = require("mongoose");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const UserMapper_1 = require("../../mappers/UserMapper");
let CommercialService = class CommercialService {
    userRepository;
    wastePlantRepository;
    pickupRepository;
    constructor(userRepository, wastePlantRepository, pickupRepository) {
        this.userRepository = userRepository;
        this.wastePlantRepository = wastePlantRepository;
        this.pickupRepository = pickupRepository;
    }
    async getCommercialService(userId) {
        const user = await this.userRepository.findUserById(userId);
        if (!user)
            throw new Error("User not found");
        return UserMapper_1.UserMapper.mapUserDTO(user);
    }
    async availableWasteService(service, wasteplantId) {
        const wasteplant = await this.wastePlantRepository.getWastePlantById(wasteplantId);
        if (!wasteplant || !Array.isArray(wasteplant.services))
            return false;
        return wasteplant.services.includes(service);
    }
    async updateCommercialPickupService(userId, updatedData) {
        const { frequency, businessName, wasteType } = updatedData;
        const existing = await this.pickupRepository.checkExistingBusiness({
            userId,
            frequency,
            businessName,
            wasteType,
        });
        if (existing?.type === "monthly") {
            throw new Error("You already submitted a pickup for this business this month.");
        }
        if (existing?.type === "daily") {
            throw new Error("You can only submit one commercial pickup request per day.");
        }
        const user = await this.userRepository.findUserById(userId);
        if (!user)
            throw new Error("User not found");
        const updatedUser = await this.userRepository.updatePartialProfileById(userId, updatedData);
        if (!updatedUser)
            throw new Error("User update failed");
        let addressIdToUse;
        if (updatedUser.addresses?.length) {
            const addressList = updatedUser.addresses;
            const latestAddress = addressList[addressList.length - 1];
            console.log("latestAddress", latestAddress);
            if (!latestAddress || !latestAddress._id)
                throw new Error("Address ID not found");
            addressIdToUse = new mongoose_1.Types.ObjectId(latestAddress._id);
        }
        else if (updatedData.selectedAddressId) {
            addressIdToUse = new mongoose_1.Types.ObjectId(updatedData.selectedAddressId);
        }
        else {
            throw new Error("No address provided or selected.");
        }
        const newPickuData = {
            userId: new mongoose_1.Types.ObjectId(userId),
            wasteplantId: user?.wasteplantId,
            addressId: addressIdToUse,
            wasteType: updatedData.wasteType,
            originalPickupDate: updatedData.pickupDate,
            pickupTime: updatedData.pickupTime,
            service: updatedData.service,
            businessName: updatedData.businessName,
            frequency: updatedData.frequency,
            status: "Pending",
        };
        const created = await this.pickupRepository.createPickup(newPickuData);
        return !!created;
    }
};
exports.CommercialService = CommercialService;
exports.CommercialService = CommercialService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CommercialService);

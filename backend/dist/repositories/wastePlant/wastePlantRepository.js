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
exports.WastePlantRepository = void 0;
const inversify_1 = require("inversify");
const wastePlantModel_1 = require("../../models/wastePlant/wastePlantModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const types_1 = __importDefault(require("../../config/inversify/types"));
let WastePlantRepository = class WastePlantRepository extends baseRepository_1.default {
    otpRepository;
    constructor(otpRepository) {
        super(wastePlantModel_1.WastePlantModel);
        this.otpRepository = otpRepository;
    }
    async createWastePlant(data) {
        const wastePlant = new this.model(data);
        console.log("wastePlantData", wastePlant);
        return await wastePlant.save();
    }
    async getWastePlantByPublicId(publicId) {
        return await this.model.findOne({
            cloudinaryPublicId: publicId
        });
    }
    async findWastePlantByEmail(email) {
        return await this.model.findOne({ email });
    }
    async findWastePlantByLicense(licenseNumber) {
        return await this.model.findOne({ licenseNumber });
    }
    async findWastePlantByTaluk(taluk) {
        const plant = await this.model.findOne({ taluk }, { _id: 1 });
        return plant ? plant._id.toString() : null;
    }
    async findWastePlantByName(plantName) {
        return await this.model.findOne({ plantName });
    }
    async getAllWastePlants(data) {
        const { page, limit, search, minCapacity, maxCapacity } = data;
        const searchRegex = new RegExp(search, "i");
        const query = {
            isDeleted: false,
            $or: [
                { plantName: { $regex: searchRegex } },
                { location: { $regex: searchRegex } },
                { subscriptionPlan: { $regex: searchRegex } },
                { contactNo: { $regex: searchRegex } },
                { status: { $regex: searchRegex } },
            ],
        };
        if (!isNaN(Number(search))) {
            query.$or.push({ capacity: Number(search) });
        }
        if (minCapacity !== undefined && maxCapacity !== undefined) {
            query.capacity = { $gte: minCapacity, $lte: maxCapacity };
        }
        const skip = (page - 1) * limit;
        const wasteplants = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.model.countDocuments(query);
        return { wasteplants, total };
    }
    async getWastePlantById(id) {
        return await this.model.findById(id);
    }
    async updateWastePlantById(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async saveOtp(email, otp) {
        await this.otpRepository.saveOtp(email, otp);
    }
    async reSaveOtp(email, otp) {
        await this.otpRepository.reSaveOtp(email, otp);
    }
    async findOtpByEmail(email) {
        return await this.otpRepository.findOtpByEmail(email);
    }
    async deleteOtp(email) {
        await this.otpRepository.deleteOtp(email);
    }
    async updateWastePlantPassword(email, hashedPassword) {
        await this.model.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true, runValidators: false });
    }
    async findByPincode(pincode) {
        await this.model.findOne({
            servicePincodes: pincode,
        });
    }
    async deleteWastePlantById(id) {
        const updatedPlant = await this.model.findByIdAndUpdate(id, { isDeleted: true, status: "Inactive" }, { new: true });
        if (!updatedPlant) {
            throw new Error("Plant not found");
        }
        return updatedPlant;
    }
    async getAllActiveWastePlants() {
        return await this.model.find({ status: "Active" });
    }
    async updatePlantStatus(plantId, status) {
        await this.model.findByIdAndUpdate(plantId, { status });
    }
    async getTotalWastePlants() {
        return await this.model.countDocuments();
    }
};
exports.WastePlantRepository = WastePlantRepository;
exports.WastePlantRepository = WastePlantRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.OtpRepository)),
    __metadata("design:paramtypes", [Object])
], WastePlantRepository);

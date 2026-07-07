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
exports.UserRepository = void 0;
const userModel_1 = require("../../models/user/userModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const mongoose_1 = require("mongoose");
let UserRepository = class UserRepository extends baseRepository_1.default {
    otpRepository;
    constructor(otpRepository) {
        super(userModel_1.UserModel);
        this.otpRepository = otpRepository;
    }
    async createUser(userData) {
        const user = new this.model(userData);
        return await user.save();
    }
    async findUserByEmail(email) {
        return await this.model.findOne({ email }).exec();
    }
    async findUserByEmailGoogleId(email, googleId) {
        return await this.model.findOne({ email, googleId }).exec();
    }
    async findUserById(userId) {
        return await this.model.findById(userId).select("-password");
    }
    async updateUserProfileById(userId, updatedData) {
        return await this.model.findByIdAndUpdate(userId, updatedData, {
            new: true,
        });
    }
    async updatePartialProfileById(userId, updatedData) {
        console.log("updatedData", updatedData);
        const updateOps = {};
        if (updatedData.phone) {
            updateOps.phone = updatedData.phone;
        }
        if (updatedData.addresses && Array.isArray(updatedData.addresses)) {
            updateOps.$push = {
                addresses: { $each: updatedData.addresses },
            };
        }
        return await this.model.findByIdAndUpdate(userId, updateOps, { new: true });
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
    async updateUserPassword(email, hashedPassword) {
        await this.model.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true, runValidators: false });
    }
    async updateAddressByIdLatLng(addressId, latitude, longitude) {
        const updatedUser = await this.model.findOneAndUpdate({ "addresses._id": addressId }, {
            $set: {
                "addresses.$.latitude": latitude,
                "addresses.$.longitude": longitude,
            },
        }, {
            new: true,
            projection: { addresses: 1 },
        });
        if (!updatedUser) {
            throw new Error("Address not found");
        }
        return updatedUser;
    }
    async findAddressByAddressId(userId, addressId, latitude, longitude) {
        return await this.model.findOneAndUpdate({
            _id: userId,
            "addresses._id": addressId,
        }, {
            $set: {
                "addresses.$.latitude": latitude,
                "addresses.$.longitude": longitude,
            },
        }, { new: true, projection: { addresses: 1 } });
    }
    async getUsersByWastePlantId(wasteplantId, page, limit, search) {
        const searchTerms = search.trim().split(" ").filter(Boolean);
        let query = { wasteplantId };
        if (searchTerms.length) {
            query.$or = [
                {
                    $and: searchTerms.map((term) => ({
                        $or: [
                            { firstName: { $regex: term, $options: "i" } },
                            { lastName: { $regex: term, $options: "i" } },
                        ],
                    })),
                },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const users = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.model.countDocuments(query);
        console.log("users", users);
        return { users, total };
    }
    async fetchAllUsersByPlantId(plantId) {
        const objectId = new mongoose_1.Types.ObjectId(plantId);
        const totalCount = await this.model.countDocuments({
            wasteplantId: objectId,
        });
        return totalCount;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.OtpRepository)),
    __metadata("design:paramtypes", [Object])
], UserRepository);

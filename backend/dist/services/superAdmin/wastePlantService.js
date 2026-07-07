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
exports.WastePlantService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const wastePlantDuplicateValidator_1 = require("../../utils/wastePlantDuplicateValidator");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const WastePlantMapper_1 = require("../../mappers/WastePlantMapper");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
let WastePlantService = class WastePlantService {
    _wastePlantRepository;
    _notificationRepository;
    _subscriptionPaymentRepository;
    _pickupReqRepository;
    constructor(_wastePlantRepository, _notificationRepository, _subscriptionPaymentRepository, _pickupReqRepository) {
        this._wastePlantRepository = _wastePlantRepository;
        this._notificationRepository = _notificationRepository;
        this._subscriptionPaymentRepository = _subscriptionPaymentRepository;
        this._pickupReqRepository = _pickupReqRepository;
    }
    async addWastePlant(data) {
        await (0, wastePlantDuplicateValidator_1.checkForDuplicateWastePlant)({
            email: data.email,
            licenseNumber: data.licenseNumber,
            plantName: data.plantName,
        }, this._wastePlantRepository);
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        const now = new Date();
        const newData = {
            ...data,
            password: hashedPassword,
            autoSubscribeAt: new Date(now.getTime() + 5 * 60 * 1000),
            subscribeNotificationSent: false,
        };
        const plant = await this._wastePlantRepository.createWastePlant(newData);
        if (!plant) {
            throw new Error("Failed to create waste plant");
        }
        return true;
    }
    async getLicenseUrl(publicId, role) {
        const plant = await this._wastePlantRepository.getWastePlantByPublicId(publicId);
        if (!plant) {
            throw new Error("Waste plant not found");
        }
        if (!plant.cloudinaryPublicId) {
            throw new Error("License document not found");
        }
        console.log("publicid", plant.cloudinaryPublicId);
        if (role !== "superadmin") {
            throw new Error("Unauthorized");
        }
        const url = cloudinary_1.default.utils.private_download_url(plant.cloudinaryPublicId, "pdf", {
            resource_type: "raw",
            expires_at: Math.floor(Date.now() / 1000) + 300,
        });
        return url;
    }
    async getAllWastePlants(data) {
        const plantData = await this._wastePlantRepository.getAllWastePlants(data);
        if (!plantData) {
            throw new Error("Wasteplants not found.");
        }
        const paidPayments = await this._subscriptionPaymentRepository.findPaidSubscriptionPayments();
        if (!paidPayments) {
            throw new Error("Paid subscription plans not found.");
        }
        const now = new Date();
        const latestPaymentsMap = new Map();
        for (const payment of paidPayments) {
            const existing = latestPaymentsMap.get(payment.wasteplantId?.toString());
            if (payment?.expiredAt &&
                (!existing ||
                    (existing.expiredAt &&
                        new Date(payment.expiredAt) > new Date(existing.expiredAt)))) {
                latestPaymentsMap.set(payment.wasteplantId?.toString(), payment);
            }
        }
        // Add latestSubscription info to each plant
        const updatedPlants = [];
        for (const plant of plantData.wasteplants) {
            const plantIdStr = plant._id.toString();
            const latestPayment = latestPaymentsMap.get(plantIdStr);
            const dto = WastePlantMapper_1.WastePlantMapper.mapWastePlantDTO(plant);
            if (latestPayment) {
                const expiredAt = new Date(latestPayment.expiredAt);
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const startOfExpiry = new Date(expiredAt.getFullYear(), expiredAt.getMonth(), expiredAt.getDate());
                const daysLeft = Math.max(0, Math.floor((startOfExpiry.getTime() - startOfToday.getTime()) /
                    (1000 * 60 * 60 * 24)));
                if (daysLeft === 0 && plant.status !== "Inactive") {
                    await this._wastePlantRepository.updatePlantStatus(plantIdStr, "Inactive");
                    plant.status = "Inactive";
                    dto.status = "Inactive";
                }
                updatedPlants.push({
                    plantData: dto,
                    latestSubscription: {
                        subPaymentStatus: latestPayment.status,
                        expiredAt,
                        daysLeft,
                    },
                });
            }
            else {
                updatedPlants.push({
                    plantData: dto,
                    latestSubscription: null,
                });
            }
        }
        return {
            total: plantData.total,
            wasteplants: updatedPlants,
        };
    }
    async getWastePlantByIdService(id) {
        const plant = await this._wastePlantRepository.getWastePlantById(id);
        if (!plant) {
            throw new Error("Plant not found.");
        }
        return WastePlantMapper_1.WastePlantMapper.mapWastePlantDTO(plant);
    }
    async updateWastePlantByIdService(id, data) {
        const updated = await this._wastePlantRepository.updateWastePlantById(id, data);
        return !!updated;
    }
    async deleteWastePlantByIdService(id) {
        const plant = await this._wastePlantRepository.deleteWastePlantById(id);
        if (!plant) {
            throw new Error("Plant not found.");
        }
        return { plantId: plant._id.toString() };
    }
    async plantBlockStatus(plantId, isBlocked) {
        const wasteplant = await this._wastePlantRepository.getWastePlantById(plantId);
        if (!wasteplant) {
            throw new Error("Plant not found.");
        }
        wasteplant.isBlocked = isBlocked;
        const pickupReqsts = await this._pickupReqRepository.getAllPickupsByStatus(plantId);
        console.log("pickupReqsts", pickupReqsts);
        const distinctUserIds = [
            ...new Set(pickupReqsts.map((p) => p.userId?.toString()).filter(Boolean)),
        ];
        console.log("distinctUserIds", distinctUserIds);
        const io = globalThis.io;
        if (isBlocked) {
            wasteplant.blockedAt = new Date();
            // wasteplant.autoUnblockAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            wasteplant.autoUnblockAt = new Date(Date.now() + 5 * 60 * 1000);
            wasteplant.unblockNotificationSent = false;
            for (const userId of distinctUserIds) {
                const message = `Your scheduled pickup with ${wasteplant.plantName} is temporarily unavailable due to a short maintenance break.  
Our team is working on it, and services will be back within 24 hours.  
Thank you for your understanding.`;
                const userNotification = await this._notificationRepository.createNotification({
                    receiverId: userId,
                    receiverType: "user",
                    senderId: plantId,
                    senderType: "wasteplant",
                    message,
                    type: "general",
                });
                if (io) {
                    io.to(`${userId}`).emit("newNotification", userNotification);
                }
                console.log("Sent notification to user:", userId);
            }
        }
        else {
            wasteplant.blockedAt = null;
            wasteplant.autoUnblockAt = null;
            wasteplant.unblockNotificationSent = true;
            for (const userId of distinctUserIds) {
                const message = `Your scheduled pickup with ${wasteplant.plantName} is now available again.  
Thank you for your patience.`;
                const userNotification = await this._notificationRepository.createNotification({
                    receiverId: userId,
                    receiverType: "user",
                    senderId: plantId,
                    senderType: "wasteplant",
                    message,
                    type: "general",
                });
                if (io) {
                    io.to(`${userId}`).emit("newNotification", userNotification);
                }
                console.log("Sent notification to user:", userId);
            }
        }
        await wasteplant.save({ validateModifiedOnly: true });
        return WastePlantMapper_1.WastePlantMapper.mapWastePlantDTO(wasteplant);
    }
};
exports.WastePlantService = WastePlantService;
exports.WastePlantService = WastePlantService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.NotificationRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.SubscriptionPaymentRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], WastePlantService);

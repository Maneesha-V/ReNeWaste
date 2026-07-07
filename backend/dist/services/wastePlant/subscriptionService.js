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
exports.SubscriptionService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const SubscriptionPlanMapper_1 = require("../../mappers/SubscriptionPlanMapper");
const notificationUtils_1 = require("../../utils/notificationUtils");
const SubscriptionPaymentMapper_1 = require("../../mappers/SubscriptionPaymentMapper");
let SubscriptionService = class SubscriptionService {
    _wastePlantRepository;
    _subscriptionRepository;
    _subscriptionPaymentRepository;
    superAdminRepository;
    constructor(_wastePlantRepository, _subscriptionRepository, _subscriptionPaymentRepository, superAdminRepository) {
        this._wastePlantRepository = _wastePlantRepository;
        this._subscriptionRepository = _subscriptionRepository;
        this._subscriptionPaymentRepository = _subscriptionPaymentRepository;
        this.superAdminRepository = superAdminRepository;
    }
    async fetchSubscriptionPlan(plantId) {
        const plant = await this._wastePlantRepository.getWastePlantById(plantId);
        if (!plant) {
            throw new Error("Plant is not found.");
        }
        console.log("plant", plant);
        const subPlanPaymentData = await this._subscriptionPaymentRepository.findPlantSubscriptionPayment(plant._id.toString());
        if (!subPlanPaymentData) {
            throw new Error("No such subscription payment found.");
        }
        const registeredPlan = await this._subscriptionRepository.getSubscriptionPlanById(subPlanPaymentData.planId.toString());
        if (!registeredPlan) {
            throw new Error("No such subscription plan found.");
        }
        const plantData = {
            createdAt: plant.createdAt,
            status: plant.status,
            plantName: plant.plantName,
            ownerName: plant.ownerName,
            license: plant.licenseNumber,
            expiredAt: subPlanPaymentData.expiredAt,
        };
        return {
            plantData,
            subscriptionData: SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlanDTO(registeredPlan),
        };
    }
    async fetchSubscriptionPlans(plantId) {
        const plant = await this._wastePlantRepository.getWastePlantById(plantId);
        if (!plant) {
            throw new Error("Plant is not found.");
        }
        const subscriptionPlans = await this._subscriptionRepository.getActiveSubscriptionPlans();
        if (!subscriptionPlans) {
            throw new Error("No active subscription plans found.");
        }
        return SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans);
    }
    async cancelSubcptReason(plantId, subPayId, reason) {
        const plant = await this._wastePlantRepository.getWastePlantById(plantId);
        if (!plant) {
            throw new Error("Plant not found.");
        }
        const admin = await this.superAdminRepository.findAdminByRole("superadmin");
        if (!admin) {
            throw new Error("Superadmin not found.");
        }
        const updatedSubcptnRequest = await this._subscriptionPaymentRepository.updateSubptnPaymentStatus(subPayId);
        const adminMessage = `Plant: ${plant.plantName} is requested with refund-${reason}-
        SubPaymentId-${updatedSubcptnRequest._id.toString()}`;
        const adminId = admin._id.toString();
        await (0, notificationUtils_1.sendNotification)({
            receiverId: adminId,
            receiverType: admin.role,
            senderId: plantId,
            senderType: "wasteplant",
            message: adminMessage,
            type: "subscriptn-refund-req",
        });
        return SubscriptionPaymentMapper_1.SubscriptionPaymentMapper.mapSubscptnPaymentDTO(updatedSubcptnRequest);
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.SubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.SubscriptionPaymentRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.SuperAdminRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], SubscriptionService);

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
let SubscriptionService = class SubscriptionService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async createSubscriptionPlan(data) {
        const existingPlanName = await this.subscriptionRepository.checkPlanNameExist(data.planName);
        if (existingPlanName) {
            throw new Error("Plan name already exists.");
        }
        const updated = await this.subscriptionRepository.createSubscriptionPlan(data);
        return !!updated;
    }
    async fetchSubscriptionPlans(data) {
        const { subscriptionPlans, total } = await this.subscriptionRepository.getAllSubscriptionPlans(data);
        return {
            subscriptionPlans: SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans),
            total,
        };
    }
    async fetchActiveSubscriptionPlans() {
        const subscriptionPlans = await this.subscriptionRepository.getActiveSubscriptionPlans();
        return SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans);
    }
    async deleteSubscriptionPlan(id) {
        const updated = await this.subscriptionRepository.deleteSubscriptionPlanById(id);
        return SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlanDTO(updated);
    }
    async getSubscriptionPlanById(id) {
        const subscriptionPlan = await this.subscriptionRepository.getSubscriptionPlanById(id);
        return SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlanDTO(subscriptionPlan);
    }
    async updateSubscriptionPlanById({ id, data, }) {
        const existingPlan = await this.subscriptionRepository.getSubscriptionPlanById(id);
        if (!existingPlan) {
            throw new Error("Subscription plan not found.");
        }
        if (data.planName && data.planName !== existingPlan.planName) {
            const duplicate = await this.subscriptionRepository.checkPlanNameExist(data.planName);
            if (duplicate) {
                throw new Error("Plan name already exists.");
            }
        }
        const plan = await this.subscriptionRepository.updateSubscriptionPlanById({
            id,
            data,
        });
        return SubscriptionPlanMapper_1.SubscriptionPlanMapper.mapSubscptnPlanDTO(plan);
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object])
], SubscriptionService);

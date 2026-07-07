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
exports.ProfileService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const WastePlantMapper_1 = require("../../mappers/WastePlantMapper");
let ProfileService = class ProfileService {
    wastePlantRepository;
    constructor(wastePlantRepository) {
        this.wastePlantRepository = wastePlantRepository;
    }
    async getPlantProfile(plantId) {
        const wasteplant = await this.wastePlantRepository.getWastePlantById(plantId);
        if (!wasteplant)
            throw new Error("Wasteplant not found");
        return WastePlantMapper_1.WastePlantMapper.mapWastePlantDTO(wasteplant);
    }
    async updatePlantProfile(plantId, updatedData) {
        const wasteplant = await this.wastePlantRepository.getWastePlantById(plantId);
        if (!wasteplant)
            throw new Error("Plant not found");
        const updated = await this.wastePlantRepository.updateWastePlantById(plantId, updatedData);
        if (!updated) {
            throw new Error("Plant can't update.");
        }
        return WastePlantMapper_1.WastePlantMapper.mapWastePlantDTO(updated);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __metadata("design:paramtypes", [Object])
], ProfileService);

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
exports.DropSpotService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const DropSpotMapper_1 = require("../../mappers/DropSpotMapper");
let DropSpotService = class DropSpotService {
    userRepository;
    dropSpotRepository;
    constructor(userRepository, dropSpotRepository) {
        this.userRepository = userRepository;
        this.dropSpotRepository = dropSpotRepository;
    }
    async getAllNearDropSpots(userId) {
        const user = await this.userRepository.findUserById(userId);
        if (!user)
            throw new Error("User not found");
        if (!user.addresses || user.addresses.length === 0) {
            throw new Error("No address found for user");
        }
        const userAddress = user.addresses[0];
        console.log("userAddress", userAddress);
        const { location, district, state } = userAddress;
        const wasteplantId = user.wasteplantId;
        if (!wasteplantId) {
            throw new Error("User's wasteplantId is missing");
        }
        const dropspots = await this.dropSpotRepository.getDropSpotsByLocationAndWasteplant({
            location,
            district,
            state,
            wasteplantId,
        });
        console.log("drops", dropspots);
        if (!dropspots) {
            throw new Error("Drop spots not found.");
        }
        return DropSpotMapper_1.DropSpotMapper.mapDropSpotsDTO(dropspots);
    }
};
exports.DropSpotService = DropSpotService;
exports.DropSpotService = DropSpotService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.DropSpotRepository)),
    __metadata("design:paramtypes", [Object, Object])
], DropSpotService);

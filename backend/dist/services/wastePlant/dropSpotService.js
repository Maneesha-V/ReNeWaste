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
const axios_1 = __importDefault(require("axios"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const DropSpotMapper_1 = require("../../mappers/DropSpotMapper");
let DropSpotService = class DropSpotService {
    dropSpotRepository;
    constructor(dropSpotRepository) {
        this.dropSpotRepository = dropSpotRepository;
    }
    async createDropSpotService(payload) {
        console.log("payload", payload);
        const fullAddress = `${payload.addressLine}, ${payload.location}, ${payload.district}, ${payload.state}, ${payload.pincode}`;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const geoBaseUrl = process.env.GOOGLE_MAPS_GEOCODE_URL;
        const encodedAddress = encodeURIComponent(fullAddress);
        try {
            const geocodeUrl = `${geoBaseUrl}?address=${encodedAddress}&key=${apiKey}`;
            const response = await axios_1.default.get(geocodeUrl);
            console.log("response", response);
            if (response.data.status === "OK" &&
                response.data.results &&
                response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                payload.coordinates = {
                    lat: location.lat,
                    lng: location.lng,
                };
            }
            else {
                throw new Error("Unable to fetch coordinates for the given address.");
            }
            const created = await this.dropSpotRepository.createDropSpot(payload);
            return !!created;
        }
        catch (error) {
            console.error("Error in createDropSpotService:", error);
            throw error;
        }
    }
    async getAllDropSpots(wasteplantId, page, limit, search) {
        const { dropspots, total } = await this.dropSpotRepository.getDropSpotsByWastePlantId(wasteplantId, page, limit, search);
        if (!dropspots) {
            throw new Error("Dropspots not found.");
        }
        return {
            dropspots: DropSpotMapper_1.DropSpotMapper.mapDropSpotsDTO(dropspots),
            total,
        };
    }
    async getDropSpotByIdService(dropSpotId, wasteplantId) {
        const dropSpot = await this.dropSpotRepository.findDropSpotById(dropSpotId, wasteplantId);
        if (!dropSpot) {
            throw new Error("Dropspot not found.");
        }
        return DropSpotMapper_1.DropSpotMapper.mapDropSpotDTO(dropSpot);
    }
    async deleteDropSpotByIdService(dropSpotId, wasteplantId) {
        const dropSpot = await this.dropSpotRepository.deleteDropSpotById(dropSpotId, wasteplantId);
        if (!dropSpot) {
            throw new Error("Dropspot not found.");
        }
        return DropSpotMapper_1.DropSpotMapper.mapDropSpotDTO(dropSpot);
    }
    async updateDropSpotService(wasteplantId, dropSpotId, updateData) {
        const dropSpot = await this.dropSpotRepository.findDropSpotById(dropSpotId, wasteplantId);
        if (!dropSpot) {
            throw new Error("Dropspot not found.");
        }
        const updatedDropSpot = await this.dropSpotRepository.updateDropSpot(dropSpotId, updateData);
        if (!updatedDropSpot) {
            throw new Error("Dropspot updation failed.");
        }
        return DropSpotMapper_1.DropSpotMapper.mapDropSpotDTO(updatedDropSpot);
    }
};
exports.DropSpotService = DropSpotService;
exports.DropSpotService = DropSpotService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DropSpotRepository)),
    __metadata("design:paramtypes", [Object])
], DropSpotService);

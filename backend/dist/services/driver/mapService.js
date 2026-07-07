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
exports.MapService = void 0;
const axios_1 = __importDefault(require("axios"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
let MapService = class MapService {
    userRepository;
    pickupRepository;
    constructor(userRepository, pickupRepository) {
        this.userRepository = userRepository;
        this.pickupRepository = pickupRepository;
    }
    async getAndSaveETA(origin, destination, pickupReqId, addressId) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const distBaseUrl = process.env.GOOGLE_MAPS_DISTANCE_URL;
        const geoBaseUrl = process.env.GOOGLE_MAPS_GEOCODE_URL;
        const encodedDestination = encodeURIComponent(destination);
        try {
            // 1. Get ETA
            const distUrl = `${distBaseUrl}?origins=${origin}&destinations=${encodedDestination}&key=${apiKey}`;
            const distRes = await axios_1.default.get(distUrl);
            const duration = distRes.data?.rows?.[0]?.elements?.[0]?.duration;
            if (!duration)
                throw new Error("Could not retrieve ETA");
            console.log("dur", duration);
            // 2. Get Lat/Lng
            const geoUrl = `${geoBaseUrl}?address=${encodedDestination}&key=${apiKey}`;
            const geoRes = await axios_1.default.get(geoUrl);
            const location = geoRes.data.results[0]?.geometry?.location;
            if (!location)
                throw new Error("Could not retrieve lat/lng");
            console.log("geo-loca", location);
            // 3. Find the user's matching address and update it
            await this.userRepository.updateAddressByIdLatLng(addressId, location.lat, location.lng);
            // 4. Save ETA in pickup request tracking
            await this.pickupRepository.updateETAAndTracking(pickupReqId, {
                eta: {
                    text: duration.text,
                    value: duration.value,
                },
            });
            return {
                duration,
                location,
            };
        }
        catch (error) {
            console.error("Google Maps API error:", error);
            throw new Error("Could not retrieve ETA or update coordinates");
        }
    }
};
exports.MapService = MapService;
exports.MapService = MapService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __metadata("design:paramtypes", [Object, Object])
], MapService);

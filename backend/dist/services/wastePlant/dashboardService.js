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
exports.DashboardService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
let DashboardService = class DashboardService {
    wastePlantRepository;
    driverRepository;
    truckRepository;
    pickupRepository;
    wasteCollectionRepository;
    _walletRepository;
    _ratingRepository;
    constructor(wastePlantRepository, driverRepository, truckRepository, pickupRepository, wasteCollectionRepository, _walletRepository, _ratingRepository) {
        this.wastePlantRepository = wastePlantRepository;
        this.driverRepository = driverRepository;
        this.truckRepository = truckRepository;
        this.pickupRepository = pickupRepository;
        this.wasteCollectionRepository = wasteCollectionRepository;
        this._walletRepository = _walletRepository;
        this._ratingRepository = _ratingRepository;
    }
    async getDashboardData(data) {
        const { plantId } = data;
        const [drivers, trucks, pickupStatus, totalWaste] = await Promise.all([
            // this.pickupRepository.totalRevenueByPlantId(plantId),
            this.driverRepository.fetchAllDriversByPlantId(plantId),
            this.truckRepository.fetchAllTrucksByPlantId(plantId),
            this.pickupRepository.fetchAllPickupsByPlantId(plantId),
            this.wasteCollectionRepository.totalWasteAmount(plantId),
        ]);
        const totalActivePickups = pickupStatus.Residential.Active + pickupStatus.Commercial.Active;
        const totalCompletedPickups = pickupStatus.Residential.Completed + pickupStatus.Commercial.Completed;
        const pickupTrends = await this.pickupRepository.fetchAllCompletedPickups(data);
        console.log("pickupTrends", pickupTrends);
        const { revenueTrends, wasteplantTotRevenue } = await this._walletRepository.fetchFilteredWPRevenue(data);
        console.log("revenueTrends", revenueTrends);
        const ratings = await this._ratingRepository.getWPRatingSummary(plantId);
        console.log("ratings", ratings);
        return {
            summary: {
                totalDrivers: drivers,
                totalTrucks: trucks,
                totalActivePickups,
                totalCompletedPickups,
                totalWasteCollected: totalWaste,
                totalRevenue: wasteplantTotRevenue,
            },
            pickupStatus,
            drivers,
            trucks,
            pickupTrends,
            revenueTrends,
            ratings
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __param(4, (0, inversify_1.inject)(types_1.default.WasteCollectionRepository)),
    __param(5, (0, inversify_1.inject)(types_1.default.WalletRepository)),
    __param(6, (0, inversify_1.inject)(types_1.default.RatingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], DashboardService);

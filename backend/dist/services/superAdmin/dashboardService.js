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
    _wastePlantRepository;
    _superAdminRepository;
    _truckRepository;
    _driverRepository;
    _wasteCollectionRepository;
    _pickupRepository;
    constructor(_wastePlantRepository, _superAdminRepository, _truckRepository, _driverRepository, _wasteCollectionRepository, _pickupRepository) {
        this._wastePlantRepository = _wastePlantRepository;
        this._superAdminRepository = _superAdminRepository;
        this._truckRepository = _truckRepository;
        this._driverRepository = _driverRepository;
        this._wasteCollectionRepository = _wasteCollectionRepository;
        this._pickupRepository = _pickupRepository;
    }
    async fetchSuperAdminDashboard(adminId) {
        const admin = await this._superAdminRepository.getSuperAdminById(adminId);
        if (!admin) {
            throw new Error("Admin not found.");
        }
        const adminData = {
            name: admin.username,
        };
        const totalPlants = await this._wastePlantRepository.getTotalWastePlants();
        const totalTrucks = await this._truckRepository.getTotalTrucks();
        const totalDrivers = await this._driverRepository.getTotalDrivers();
        const totalWasteCollected = await this._wasteCollectionRepository.getTotalWasteCollected();
        const monthlyRevenue = await this._pickupRepository.totalRevenueByMonth();
        console.log({
            adminData,
            totalPlants,
            totalTrucks,
            totalDrivers,
            totalWasteCollected,
            monthlyRevenue,
        });
        return {
            adminData,
            totalPlants,
            totalTrucks,
            totalDrivers,
            totalWasteCollected,
            monthlyRevenue,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.SuperAdminRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(4, (0, inversify_1.inject)(types_1.default.WasteCollectionRepository)),
    __param(5, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], DashboardService);

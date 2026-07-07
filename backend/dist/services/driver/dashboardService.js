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
const AttendanceMapper_1 = require("../../mappers/AttendanceMapper");
let DashboardService = class DashboardService {
    _driverRepository;
    truckRepository;
    _pickupRepository;
    wastePlantRepository;
    _attendanceRepository;
    constructor(_driverRepository, truckRepository, _pickupRepository, wastePlantRepository, _attendanceRepository) {
        this._driverRepository = _driverRepository;
        this.truckRepository = truckRepository;
        this._pickupRepository = _pickupRepository;
        this.wastePlantRepository = wastePlantRepository;
        this._attendanceRepository = _attendanceRepository;
    }
    async fetchDriverDashboard(driverId) {
        const driver = await this._driverRepository.getDriverById(driverId);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        console.log("-driver", driver);
        const driverData = {
            name: driver.name,
            email: driver.email,
            assignedZone: driver.assignedZone ?? "Not Assigned.",
        };
        let truckData = null;
        if (driver.assignedTruckId) {
            const truck = await this.truckRepository.getTruckById(driver.assignedTruckId.toString());
            if (truck) {
                truckData = {
                    name: truck.name,
                    vehicleNumber: truck.vehicleNumber,
                    status: truck.status,
                };
            }
        }
        const { assignedCount, completedCount } = await this._pickupRepository.getDriverTotalPickups(driverId);
        const driverPickups = await this._pickupRepository.getDriverCompletedPickups(driverId);
        console.log("driveerPIckups", driverPickups);
        const recentActivities = driverPickups.map((p) => {
            const selectedAddress = p.userId.addresses.find((ad) => ad._id.toString() === p.addressId.toString());
            if (!selectedAddress) {
                throw new Error(`Address not found for pickup ${p.pickupId}`);
            }
            return {
                pickupId: p.pickupId,
                status: p.status,
                completedAt: p.completedAt,
                selectedAddress,
            };
        });
        const driverAttendanceData = await this._attendanceRepository.findAttendancesByDriverId(driverId);
        //    if (!driverAttendanceData) {
        //   throw new Error("Driver attendances not found.");
        // }
        console.log("driverAttendanceData", driverAttendanceData);
        const dashboardSummary = {
            driver: driverData,
            truck: truckData,
            pickupStats: {
                assignedTasks: assignedCount,
                completedTasks: completedCount,
            },
            recentActivities,
            attendanceData: driverAttendanceData
        };
        return { summary: dashboardSummary };
    }
    async fetchWastePlantSupport(driverId) {
        const driver = await this._driverRepository.getDriverById(driverId);
        let plantData = null;
        if (driver) {
            const wasteplant = await this.wastePlantRepository.getWastePlantById(driver.wasteplantId.toString());
            if (wasteplant) {
                plantData = {
                    plantName: wasteplant.plantName,
                    ownerName: wasteplant.ownerName,
                    location: wasteplant.location,
                    district: wasteplant.district,
                    taluk: wasteplant.taluk,
                    pincode: wasteplant.pincode,
                    state: wasteplant.state,
                    contactInfo: wasteplant.contactInfo,
                    contactNo: wasteplant.contactNo,
                    email: wasteplant.email,
                };
            }
        }
        return { supportInfo: plantData };
    }
    async markAttendance(driverId, status) {
        const driver = await this._driverRepository.getDriverById(driverId);
        if (!driver)
            throw new Error("Driver not found");
        const attendance = await this._attendanceRepository.createAttendance({
            driverId,
            status,
            wasteplantId: driver.wasteplantId?.toString(),
            assignedTruckId: driver.assignedTruckId?.toString(),
        });
        return AttendanceMapper_1.AttendanceMapper.mapAttendanceDTO(attendance);
    }
    async fetchDriverEarnStats(data) {
        const { driverId, filter, from, to } = data;
        const stats = await this._attendanceRepository.getDriverEarnRewardStats(data);
        return stats;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(4, (0, inversify_1.inject)(types_1.default.AttendanceRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DashboardService);

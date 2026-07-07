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
exports.TruckService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const TruckMapper_1 = require("../../mappers/TruckMapper");
const DriverMapper_1 = require("../../mappers/DriverMapper");
let TruckService = class TruckService {
    truckRepository;
    driverRepository;
    _attendanceRepository;
    _pickupRepository;
    constructor(truckRepository, driverRepository, _attendanceRepository, _pickupRepository) {
        this.truckRepository = truckRepository;
        this.driverRepository = driverRepository;
        this._attendanceRepository = _attendanceRepository;
        this._pickupRepository = _pickupRepository;
    }
    async getTruckForDriver(driverId, wasteplantId) {
        const trucks = await this.truckRepository.getAssignedAvailableTrucks(driverId, wasteplantId);
        if (!trucks || trucks.length === 0) {
            return [];
        }
        return TruckMapper_1.TruckMapper.mapAvailableTrucksDTO(trucks);
    }
    async requestTruck(driverId) {
        const driver = await this.truckRepository.reqTruckToWastePlant(driverId);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        return DriverMapper_1.DriverMapper.mapDriverDTO(driver);
    }
    async markTruckReturnService({ truckId, plantId, driverId, }) {
        const { driver, truck } = await this.driverRepository.markTruckAsReturned(truckId, plantId, driverId);
        if (!driver || !truck) {
            throw new Error("Driver or truck not found");
        }
        const totalPickups = await this._pickupRepository.findDriverPlantTruckById({
            truckId,
            plantId,
            driverId,
        });
        const totalPickupsCount = totalPickups?.length || 0;
        let workType = "noEarning";
        if (totalPickupsCount >= 6)
            workType = "fullDay";
        else if (totalPickupsCount >= 4)
            workType = "halfDay";
        // const totalReward = totalPickups.reduce((sum, pickup) => {
        //   const baseAmount =
        //     pickup.wasteType === "Residential"
        //       ? 100
        //       : pickup.wasteType === "Commercial"
        //         ? 200
        //         : 0;
        //   const reward = baseAmount * 0.3;
        //   return sum + reward;
        // }, 0);
        const earnings = workType === "fullDay" ? 500 : workType === "halfDay" ? 300 : 0;
        const driverAttendance = await this._attendanceRepository.findDriverAttendance({
            truckId,
            plantId,
            driverId,
        });
        if (!driverAttendance) {
            throw new Error("Attendance record not found for today");
        }
        // driverAttendance.totalPickups = totalPickupsCount;
        driverAttendance.workType = workType;
        // driverAttendance.reward = totalReward;
        driverAttendance.earning = earnings;
        await driverAttendance.save();
        console.log({ earnings });
        return true;
    }
};
exports.TruckService = TruckService;
exports.TruckService = TruckService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.TruckRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.AttendanceRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], TruckService);

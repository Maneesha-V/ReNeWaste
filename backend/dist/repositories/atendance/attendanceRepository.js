"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AttendanceRepository = void 0;
const inversify_1 = require("inversify");
const attendanceModel_1 = require("../../models/attendance/attendanceModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const types_1 = __importDefault(require("../../config/inversify/types"));
const mongoose_1 = __importStar(require("mongoose"));
let AttendanceRepository = class AttendanceRepository extends baseRepository_1.default {
    _driverRepository;
    constructor(_driverRepository) {
        super(attendanceModel_1.AttendanceModel);
        this._driverRepository = _driverRepository;
    }
    async createAttendance(data) {
        return await this.model.create({
            driverId: data.driverId,
            wasteplantId: data.wasteplantId,
            assignedTruckId: data.assignedTruckId,
            status: data.status,
            date: new Date(),
        });
    }
    async findDriverAttendance(data, session) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return await this.model.findOne({
            driverId: data.driverId,
            wasteplantId: data.plantId,
            assignedTruckId: data.truckId,
            status: "present",
            date: { $gte: startOfToday, $lte: endOfToday },
        }, null, session ? { session } : {});
    }
    async getDriverEarnRewardStats(data) {
        const { driverId, filter, from, to } = data;
        console.log("data", data);
        const startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        const matchStage = {
            driverId: new mongoose_1.default.Types.ObjectId(driverId),
            status: "present",
        };
        if (filter === "custom" && from && to) {
            matchStage.date = { $gte: startDate, $lte: endDate };
        }
        let groupStage;
        let dateFormat = "";
        if (filter === "daily") {
            groupStage = {
                _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                },
                totalReward: { $sum: "$reward" },
                totalEarning: { $sum: "$earning" },
            };
        }
        else if (filter === "monthly") {
            groupStage = {
                _id: {
                    month: { $dateToString: { format: "%b %Y", date: "$date" } },
                },
                totalReward: { $sum: "$reward" },
                totalEarning: { $sum: "$earning" },
            };
        }
        else if (filter === "yearly") {
            groupStage = {
                _id: {
                    year: { $dateToString: { format: "%Y", date: "$date" } },
                },
                totalReward: { $sum: "$reward" },
                totalEarning: { $sum: "$earning" },
            };
        }
        else if (filter === "custom") {
            groupStage = {
                _id: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                },
                totalReward: { $sum: "$reward" },
                totalEarning: { $sum: "$earning" },
            };
        }
        else {
            throw new Error("Invalid filter");
        }
        return await this.model.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $sort: { _id: -1 } },
        ]);
    }
    async findAttendancesByDriverId(driverId) {
        const startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        const driverObjectId = new mongoose_1.Types.ObjectId(driverId);
        return await this.model.aggregate([
            {
                $match: {
                    driverId: driverObjectId,
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: "$workType",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    workType: "$_id",
                    count: 1,
                },
            },
        ]);
    }
};
exports.AttendanceRepository = AttendanceRepository;
exports.AttendanceRepository = AttendanceRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __metadata("design:paramtypes", [Object])
], AttendanceRepository);

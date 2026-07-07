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
exports.PickupRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const pickupModel_1 = require("../../models/pickupRequests/pickupModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const dateUtils_1 = require("../../utils/dateUtils");
let PickupRepository = class PickupRepository extends baseRepository_1.default {
    _userRepository;
    _driverRepository;
    constructor(_userRepository, _driverRepository) {
        super(pickupModel_1.PickupModel);
        this._userRepository = _userRepository;
        this._driverRepository = _driverRepository;
    }
    async getPickupById(pickupReqId) {
        const pickup = await this.model.findById(pickupReqId);
        if (!pickup)
            throw new Error("Pickup not found");
        return pickup;
    }
    async createPickup(pickupData) {
        const count = await this.model.countDocuments();
        const paddedId = String(count + 1).padStart(4, "0");
        const pickupId = `PUR${paddedId}`;
        const newPickup = new this.model({
            ...pickupData,
            pickupId,
        });
        return await newPickup.save();
    }
    async getPickupsByPlantId(filters) {
        const { plantId, status, wasteType } = filters;
        const query = {
            wasteplantId: new mongoose_1.default.Types.ObjectId(plantId),
            status,
        };
        if (wasteType) {
            query.wasteType = wasteType;
        }
        const pickups = await this.model
            .find(query)
            .populate({
            path: "userId",
            select: "firstName lastName addresses",
        })
            .populate({
            path: "driverId",
            select: "name assignedZone",
        })
            .sort({ createdAt: -1 });
        console.log("pickups", pickups);
        return pickups.map((pickup) => {
            const pickupObj = pickup.toObject();
            const userName = pickup.userId
                ? `${pickup.userId.firstName} ${pickup.userId.lastName}`
                : "Unknown";
            const userAddress = pickup.userId?.addresses?.find((address) => address._id.toString() === pickup.addressId?.toString());
            console.log("userAddress", userAddress);
            const location = userAddress?.location || "Unknown";
            const driverName = pickup.driverId?.name || null;
            const assignedZone = pickup.driverId?.assignedZone || null;
            return {
                ...pickupObj,
                userName,
                userAddress,
                location,
                driverName,
                assignedZone,
            };
        });
    }
    async updatePickupStatusAndDriver(pickupReqId, updateData) {
        const objectId = new mongoose_1.Types.ObjectId(pickupReqId);
        const updated = await this.model
            .findByIdAndUpdate(objectId, {
            $set: {
                status: updateData.status,
                driverId: updateData.driverId,
                truckId: updateData.truckId,
            },
        }, { new: true })
            .exec();
        if (!updated) {
            throw new Error("Pickup request not found");
        }
        return updated;
    }
    async updatePickupRequest(pickupReqId) {
        try {
            const updatedPickupRequest = await this.model.findByIdAndUpdate(pickupReqId, { $set: { status: "Cancelled" } }, { new: true });
            if (!updatedPickupRequest) {
                throw new Error("Pickup request not found.");
            }
            return updatedPickupRequest;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error in updating the pickup request.");
        }
    }
    async updatePickupDate(pickupReqId, updateData) {
        const updated = await this.model.findByIdAndUpdate(pickupReqId, updateData, { new: true });
        if (!updated) {
            throw new Error("Pickup request not found during update");
        }
        return updated;
    }
    async getPickupsByDriverId(filters) {
        const { driverId } = filters;
        const driver = await this._driverRepository.getDriverById(driverId);
        if (!driver) {
            throw new Error("Driver not found");
        }
        const pickups = (await this.model
            .find({
            driverId: driverId,
            wasteType: driver.category,
            status: { $in: ["Scheduled", "Rescheduled"] },
        })
            // .sort({
            //   originalPickupDate: 1,
            //   pickupTime: 1
            // })
            .populate({
            path: "userId",
            select: "firstName lastName addresses",
        }));
        const enhancedPickups = pickups
            .map((pickup) => {
            const user = pickup.userId;
            const matchedAddress = user.addresses?.find((addr) => addr._id.toString() === pickup.addressId.toString());
            return {
                ...pickup.toObject?.(),
                userName: `${user.firstName} ${user.lastName}`,
                userAddress: matchedAddress,
            };
        })
            .sort((a, b) => {
            const dateA = new Date(a.rescheduledPickupDate || a.originalPickupDate);
            const dateB = new Date(b.rescheduledPickupDate || b.originalPickupDate);
            const dateDiff = dateA.getTime() - dateB.getTime();
            if (dateDiff !== 0)
                return dateDiff;
            return a.pickupTime.localeCompare(b.pickupTime);
        });
        return enhancedPickups;
    }
    async findPickupByIdAndDriver(pickupReqId, driverId) {
        const pickup = (await this.model
            .findOne({
            _id: pickupReqId,
            driverId,
        })
            .populate({
            path: "userId",
            select: "firstName lastName addresses",
        }));
        // if (!pickup) return null;
        const userAddress = pickup.userId.addresses.map((add) => add._id === pickup.addressId.toString());
        const userName = `${pickup.userId.firstName} ${pickup.userId.lastName}`;
        return {
            ...pickup.toObject(),
            userAddress,
            userName,
        };
    }
    // async findPickupByIdAndDriver(pickupReqId: string, driverId: string) {
    //   const objectIdPickup = new Types.ObjectId(pickupReqId);
    //   const objectIdDriver = new Types.ObjectId(driverId);
    //   const pickup = (await this.model
    //     .findOne({
    //       _id: objectIdPickup,
    //       driverId: objectIdDriver,
    //     })
    //     .lean()) as EnhancedPickup;
    //   if (!pickup) return null;
    //   const user = await this._userRepository.findOne(
    //     { _id: pickup.userId, "addresses._id": pickup.addressId },
    //     { "addresses.$": 1, firstName: 1, lastName: 1 },
    //     true
    //   );
    //   if (user && user.addresses?.[0]) {
    //     pickup.userAddress = user.addresses[0];
    //     pickup.userName = `${user.firstName} ${user.lastName}`;
    //   } else {
    //     pickup.userAddress = undefined;
    //     pickup.userName = "Unknown User";
    //   }
    //   return pickup;
    // }
    async updateETAAndTracking(pickupReqId, updateFields) {
        const res = await this.model.findByIdAndUpdate(pickupReqId, {
            eta: updateFields.eta,
            // trackingStatus: updateFields.trackingStatus,
        });
        console.log("trackk", res);
    }
    async getPickupPlansByUserId(userId, paginationData) {
        const { page, limit, search, filter } = paginationData;
        const searchRegex = new RegExp(search, "i");
        const query = {
            userId: new mongoose_1.default.Types.ObjectId(userId),
        };
        if (filter && filter !== "All") {
            query.status = filter;
        }
        if (search.trim()) {
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (dateRegex.test(search.trim())) {
                const [day, month, year] = search.trim().split("-");
                const searchDate = new Date(Number(year), Number(month) - 1, Number(day));
                const nextDay = new Date(searchDate);
                nextDay.setDate(nextDay.getDate() + 1);
                query.$or = [
                    { status: { $regex: searchRegex } },
                    { pickupTime: { $regex: searchRegex } },
                    { pickupId: { $regex: searchRegex } },
                    { originalPickupDate: { $gte: searchDate, $lt: nextDay } },
                    { rescheduledPickupDate: { $gte: searchDate, $lt: nextDay } },
                ];
            }
            else {
                query.$or = [
                    { status: { $regex: searchRegex } },
                    { pickupTime: { $regex: searchRegex } },
                    { pickupId: { $regex: searchRegex } },
                ];
            }
        }
        const skip = (page - 1) * limit;
        const [pickups, total] = await Promise.all([
            this.model
                // .find(query)
                .find({
                ...query,
                addressId: { $exists: true, $ne: null },
            })
                .sort({ originalPickupDate: 1 })
                .skip(skip)
                .limit(limit)
                .populate({
                path: "driverId",
                select: "name contact",
            })
                .populate({
                path: "truckId",
                select: "name vehicleNumber",
            })
                .lean(),
            // this.model.countDocuments(query),
            this.model.countDocuments({
                ...query,
                addressId: { $exists: true, $ne: null },
            }),
        ]);
        console.log("pickups", pickups);
        const user = await this._userRepository.findById(userId, true);
        const sortedPickups = pickups.sort((a, b) => {
            const statusOrder = {
                Pending: 1,
                Scheduled: 1,
                Completed: 3,
                Cancelled: 4,
            };
            const aStatusPriority = statusOrder[a.status] ?? 99;
            const bStatusPriority = statusOrder[b.status] ?? 99;
            if (aStatusPriority !== bStatusPriority) {
                return aStatusPriority - bStatusPriority;
            }
            const aDate = new Date(a.rescheduledPickupDate || a.originalPickupDate);
            const bDate = new Date(b.rescheduledPickupDate || b.originalPickupDate);
            const aDateTime = new Date(`${aDate.toISOString().split("T")[0]}T${a.pickupTime}:00Z`);
            const bDateTime = new Date(`${bDate.toISOString().split("T")[0]}T${b.pickupTime}:00Z`);
            return aDateTime.getTime() - bDateTime.getTime();
        });
        console.log("sortedPickups", sortedPickups);
        return {
            pickupPlans: sortedPickups.map((p) => {
                const matchedAddress = user?.addresses?.find((a) => a._id.toString() === p.addressId?.toString());
                console.log("user.addresses", user?.addresses);
                console.log("pickup.addressId", p.addressId);
                console.log("matchedAddress", matchedAddress);
                if (!matchedAddress)
                    return null;
                const address = matchedAddress
                    ? {
                        ...matchedAddress,
                        _id: matchedAddress._id.toString(),
                    }
                    : null;
                return {
                    ...p,
                    user: user
                        ? {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            phone: user.phone,
                        }
                        : null,
                    address: address,
                };
            }),
            total,
        };
    }
    async updateTrackingStatus(pickupReqId, trackingStatus) {
        const updatedPickup = await this.model.findByIdAndUpdate(pickupReqId, { trackingStatus }, { new: true });
        if (!updatedPickup) {
            throw new Error("Pickup not found");
        }
        return updatedPickup;
    }
    async updatePickupStatus(pickupReqId, status) {
        const res = await this.model.findByIdAndUpdate(pickupReqId, { status }, { new: true });
        return res;
    }
    async markPickupCompletedStatus(pickupReqId, session) {
        const pickup = await this.model.findById(pickupReqId, null, { session });
        console.log("pickup.....", pickup);
        if (!pickup) {
            throw new Error("Pickup not found");
        }
        if (pickup.trackingStatus !== "Completed") {
            throw new Error("Cannot mark pickup as completed until tracking is completed");
        }
        if (!pickup.payment) {
            throw new Error("The user has not initiated the payment yet. Please ask the user to complete the payment.");
        }
        if (pickup.payment.status !== "Paid") {
            throw new Error("Cannot mark pickup as completed until payment is completed");
        }
        pickup.status = "Completed";
        pickup.completedAt = new Date();
        await pickup.save({ session });
        return pickup;
    }
    async getPickupByUserIdAndPickupReqId(pickupReqId, userId) {
        return await this.model.findOne({
            _id: pickupReqId,
            userId: userId,
        });
    }
    // async savePaymentDetails({
    //   pickupReqId,
    //   paymentData,
    //   userId,
    // }: SavePaymentReq) {
    //   const pickup = await this.model.findOneAndUpdate(
    //     { _id: pickupReqId, userId },
    //     { $set: { payment: paymentData } },
    //     { new: true }
    //   );
    //   if (!pickup) {
    //     throw new Error("Pickup not found or unauthorized");
    //   }
    // }
    async getAllPaymentsByUser(userId, paginationData) {
        const { page, limit, search, filter } = paginationData;
        const searchRegex = new RegExp(search, "i");
        const query = {
            userId: new mongoose_1.default.Types.ObjectId(userId),
            "payment.amount": { $exists: true },
        };
        if (filter && filter !== "All") {
            if (["Paid", "Pending"].includes(filter)) {
                query["payment.status"] = filter;
            }
            else {
                query["payment.refundStatus"] = filter;
            }
        }
        if (search.trim()) {
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            const searchLower = search.toLowerCase();
            const isNumber = !isNaN(Number(search));
            if (dateRegex.test(search.trim())) {
                const [day, month, year] = search.trim().split("-");
                const searchDate = new Date(Number(year), Number(month) - 1, Number(day));
                const nextDay = new Date(searchDate);
                nextDay.setDate(nextDay.getDate() + 1);
                query.$or = [
                    { pickupId: { $regex: searchRegex } },
                    { wasteType: { $regex: searchRegex } },
                    ...(isNumber ? [{ "payment.amount": Number(search) }] : []),
                    // { "payment.status": { $regex: searchRegex } },
                    // ...(searchLower !== "pending"
                    //   ? [{ "payment.refundStatus": { $regex: searchRegex } }]
                    //   : []),
                    { "payment.refundStatus": { $regex: searchRegex } },
                    { "payment.paidAt": { $gte: searchDate, $lt: nextDay } },
                    { "payment.refundAt": { $gte: searchDate, $lt: nextDay } },
                ];
            }
            else {
                query.$or = [
                    { pickupId: { $regex: searchRegex } },
                    { wasteType: { $regex: searchRegex } },
                    ...(isNumber ? [{ "payment.amount": Number(search) }] : []),
                    // { "payment.status": { $regex: searchRegex } },
                    // ...(searchLower !== "pending"
                    //   ? [{ "payment.refundStatus": { $regex: searchRegex } }]
                    //   : []),
                    { "payment.refundStatus": { $regex: searchRegex } },
                ];
            }
        }
        const skip = (page - 1) * limit;
        const [pickups, total] = await Promise.all([
            this.model
                .find(query, {
                pickupId: 1,
                payment: 1,
                wasteType: 1,
                originalPickupDate: 1,
                rescheduledPickupDate: 1,
                status: 1,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.model.countDocuments(query),
        ]);
        return {
            pickups,
            total,
        };
    }
    async fetchAllPickupsByPlantId(plantId) {
        const pickupCounts = await this.model.aggregate([
            {
                $match: {
                    wasteplantId: new mongoose_1.Types.ObjectId(plantId),
                },
            },
            {
                $group: {
                    _id: {
                        wasteType: "$wasteType",
                        status: "$status",
                    },
                    totalCount: { $sum: 1 },
                },
            },
        ]);
        const result = {
            Residential: {
                Pending: 0,
                Scheduled: 0,
                Rescheduled: 0,
                Completed: 0,
                Cancelled: 0,
                Active: 0,
            },
            Commercial: {
                Pending: 0,
                Scheduled: 0,
                Rescheduled: 0,
                Completed: 0,
                Cancelled: 0,
                Active: 0,
            },
        };
        for (const record of pickupCounts) {
            const { wasteType, status } = record._id;
            const count = record.totalCount;
            if ((wasteType === "Residential" || wasteType === "Commercial") &&
                (status === "Pending" ||
                    status === "Scheduled" ||
                    status === "Rescheduled" ||
                    status === "Completed" ||
                    status === "Cancelled")) {
                const typeKey = wasteType;
                const statusKey = status;
                result[typeKey][statusKey] = record.totalCount;
            }
        }
        for (const type of ["Residential", "Commercial"]) {
            result[type].Active = result[type].Scheduled + result[type].Rescheduled;
        }
        return result;
    }
    async fetchAllPaymentsByPlantId(data) {
        const { plantId, page, limit, search } = data;
        const matchStage = {
            wasteplantId: new mongoose_1.Types.ObjectId(plantId),
            "payment.status": "Paid",
        };
        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "drivers",
                    localField: "driverId",
                    foreignField: "_id",
                    as: "driver",
                },
            },
            { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        ];
        // 🔍 Add a second $match after lookups for search
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { pickupId: { $regex: search, $options: "i" } },
                        { status: { $regex: search, $options: "i" } },
                        { "user.firstName": { $regex: search, $options: "i" } },
                        { "user.lastName": { $regex: search, $options: "i" } },
                        { "driver.name": { $regex: search, $options: "i" } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $toString: "$payment.amount" },
                                    regex: search,
                                    options: "i",
                                },
                            },
                        },
                    ],
                },
            });
        }
        // Final transformation and pagination
        pipeline.push({
            $project: {
                pickupId: 1,
                wasteType: 1,
                status: 1,
                "payment.status": 1,
                "payment.razorpayPaymentId": 1,
                "payment.amount": 1,
                "payment.paidAt": 1,
                "payment.refundStatus": 1,
                "payment.refundRequested": 1,
                "payment.refundAt": 1,
                "payment.inProgressExpiresAt": 1,
                "payment.walletOrderId": 1,
                driverName: "$driver.name",
                userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
                dueDate: {
                    $cond: {
                        if: { $ne: ["$rescheduledPickupDate", null] },
                        then: "$rescheduledPickupDate",
                        else: "$originalPickupDate",
                    },
                },
            },
        }, { $sort: { "payment.paidAt": -1 } }, { $skip: (page - 1) * limit }, { $limit: limit });
        // Get both data and count (filtered count)
        const [paymentData, countResult] = await Promise.all([
            this.model.aggregate(pipeline),
            this.model.aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: "drivers",
                        localField: "driverId",
                        foreignField: "_id",
                        as: "driver",
                    },
                },
                { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                ...(search
                    ? [
                        {
                            $match: {
                                $or: [
                                    { pickupId: { $regex: search, $options: "i" } },
                                    { status: { $regex: search, $options: "i" } },
                                    { "user.firstName": { $regex: search, $options: "i" } },
                                    { "user.lastName": { $regex: search, $options: "i" } },
                                    { "driver.name": { $regex: search, $options: "i" } },
                                    {
                                        $expr: {
                                            $regexMatch: {
                                                input: { $toString: "$payment.amount" },
                                                regex: search,
                                                options: "i",
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ]
                    : []),
                { $count: "total" },
            ]),
        ]);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        return {
            payments: paymentData,
            total,
        };
    }
    async updatePaymentStatus(pickupReqId) {
        try {
            const updatedPickupRequest = await this.model.findByIdAndUpdate(pickupReqId, {
                $set: {
                    "payment.refundRequested": true,
                },
            }, { new: true });
            if (!updatedPickupRequest) {
                throw new Error("Pickup request not found.");
            }
            return updatedPickupRequest;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error in updating the pickup request.");
        }
    }
    async getPickupWithUserAndPlantId(plantId, userId, pickupId) {
        const data = await this.model.findOne({
            pickupId,
            wasteplantId: plantId,
            userId,
        });
        return data;
    }
    async filterWasteReportsByPlantId(data) {
        const fromDate = new Date(`${data.from}T00:00:00.000Z`);
        const toDate = new Date(`${data.to}T23:59:59.999Z`);
        const pickups = await this.model
            .find({
            wasteplantId: data.plantId,
            "payment.paidAt": { $gte: fromDate, $lte: toDate },
            "payment.refundStatus": { $ne: "Refunded" },
        })
            .populate({
            path: "driverId",
            select: "name",
        });
        return pickups;
    }
    async fetchWasteReportsByPlantId(plantId) {
        const pickups = await this.model
            .find({
            wasteplantId: plantId,
            status: "Completed",
            "payment.refundStatus": { $ne: "Refunded" },
        })
            .populate({
            path: "driverId",
            select: "name",
        });
        return pickups;
    }
    async getDriverTotalPickups(driverId) {
        const pickups = await this.model.find({
            driverId: driverId,
            status: { $in: ["Scheduled", "Rescheduled", "Completed"] },
        });
        let assignedCount = 0;
        let completedCount = 0;
        for (const pickup of pickups) {
            if (pickup.status === "Completed") {
                completedCount++;
            }
            else {
                assignedCount++;
            }
        }
        return {
            assignedCount,
            completedCount,
        };
    }
    async getMonthlyPickupPlansByUserId(userId) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const result = await this.model.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    wasteType: "Residential",
                },
            },
            {
                $addFields: {
                    effectiveDate: {
                        $cond: [
                            { $ifNull: ["$rescheduledPickupDate", false] },
                            "$rescheduledPickupDate",
                            "$originalPickupDate",
                        ],
                    },
                },
            },
            {
                $match: {
                    effectiveDate: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth,
                    },
                },
            },
            {
                $count: "pickupCount",
            },
        ]);
        console.log("result", result);
        const count = result.length > 0 ? result[0].pickupCount : 0;
        return { count };
    }
    async totalRevenueByMonth() {
        const result = await this.model.aggregate([
            {
                $match: {
                    "payment.status": "Paid",
                    "payment.refundStatus": null,
                    "payment.paidAt": { $ne: null },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$payment.paidAt" },
                        month: { $month: "$payment.paidAt" },
                    },
                    totalRevenue: { $sum: "$payment.amount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: [
                                    { $lt: ["$_id.month", 10] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" },
                                ],
                            },
                        ],
                    },
                    totalRevenue: 1,
                },
            },
            {
                $sort: { month: 1 },
            },
        ]);
        return result;
    }
    async getAllPickupsByStatus(plantId) {
        return await this.model.find({
            wasteplantId: plantId,
            status: { $in: ["Pending", "Scheduled", "Rescheduled"] },
        });
    }
    // async checkExistingBusiness(data: CheckExistingBusinessReq) {
    //   const { userId, frequency, businessName, wasteType } = data;
    //   const now = new Date();
    //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //   const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    //   const startOfDay = new Date(
    //     now.getFullYear(),
    //     now.getMonth(),
    //     now.getDate(),
    //     0,
    //     0,
    //     0,
    //   );
    //   const endOfDay = new Date(
    //     now.getFullYear(),
    //     now.getMonth(),
    //     now.getDate(),
    //     23,
    //     59,
    //     59,
    //   );
    //   const existingMonthly = await this.model.findOne({
    //     userId,
    //     wasteType,
    //     businessName,
    //     originalPickupDate: { $gte: startOfMonth, $lte: endOfMonth },
    //   });
    //   if (existingMonthly) {
    //     return { type: "monthly", data: existingMonthly };
    //   }
    //   const existingDaily = await this.model.findOne({
    //     userId,
    //     wasteType,
    //     originalPickupDate: { $gte: startOfDay, $lte: endOfDay },
    //   });
    //   if (existingDaily) {
    //     return { type: "daily", data: existingDaily };
    //   }
    //   return null;
    // }
    async checkExistingBusiness(data) {
        const { userId, frequency, businessName, wasteType } = data;
        const now = new Date();
        let startDate;
        let endDate;
        let type;
        switch (frequency) {
            case "Daily":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                type = "daily";
                break;
            case "Weekly":
                const day = now.getDay();
                const diff = day === 0 ? 6 : day - 1;
                startDate = new Date(now);
                startDate.setDate(now.getDate() - diff);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                type = "weekly";
                break;
            case "Monthly":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                type = "monthly";
                break;
            default:
                return null;
        }
        const existingPickup = await this.model.findOne({
            userId,
            wasteType,
            businessName,
            originalPickupDate: {
                $gte: startDate,
                $lte: endDate,
            },
        });
        if (!existingPickup) {
            return null;
        }
        return {
            type,
            data: existingPickup,
        };
    }
    async checkExistingResid(data) {
        const { wasteType, pickupDate, userId } = data;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const existingDaily = await this.model.findOne({
            userId,
            wasteType,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        });
        if (existingDaily) {
            return { type: "daily", data: existingDaily };
        }
        return null;
    }
    async findDriverPlantTruckById(data) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return await this.findAll({
            wasteplantId: data.plantId,
            driverId: data.driverId,
            truckId: data.truckId,
            completedAt: { $gte: startOfToday, $lte: endOfToday },
            status: "Completed",
        });
    }
    async getDriverCompletedPickups(driverId) {
        const startOfDay = new Date();
        startOfDay.setDate(startOfDay.getDate() - 1);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        // endOfDay.setDate(endOfDay.getDate()-1)
        endOfDay.setHours(23, 59, 59, 999);
        const pickups = await this.model
            .find({
            driverId,
            status: "Completed",
            completedAt: { $gte: startOfDay, $lte: endOfDay },
        })
            .sort({ completedAt: -1 })
            .limit(5)
            .populate("userId", "addresses")
            .lean();
        return pickups;
    }
    async fetchAllCompletedPickups(data) {
        const { plantId, filter, from, to } = data;
        const { start, end } = (0, dateUtils_1.getDateRange)(filter, from, to);
        const format = (0, dateUtils_1.getGroupFormat)(filter);
        const pipeline = [
            {
                $match: {
                    wasteplantId: new mongoose_1.Types.ObjectId(plantId),
                    status: "Completed",
                },
            },
            {
                $addFields: {
                    effectivePickupDate: {
                        $ifNull: ["$rescheduledPickupDate", "$originalPickupDate"],
                    },
                },
            },
        ];
        if (start && end) {
            pipeline.push({
                $match: {
                    effectivePickupDate: {
                        $gte: start,
                        $lte: end,
                    },
                },
            });
        }
        pipeline.push({
            $group: {
                _id: {
                    $dateToString: {
                        format,
                        date: "$effectivePickupDate",
                        timezone: "Asia/Kolkata",
                    },
                },
                totalPickups: { $sum: 1 },
                residential: {
                    $sum: {
                        $cond: [{ $eq: ["$wasteType", "Residential"] }, 1, 0],
                    },
                },
                commercial: {
                    $sum: {
                        $cond: [{ $eq: ["$wasteType", "Commercial"] }, 1, 0],
                    },
                },
            },
        }, { $sort: { _id: 1 } }, {
            $project: {
                _id: 0,
                date: "$_id",
                totalPickups: 1,
                residential: 1,
                commercial: 1,
            },
        });
        return this.model.aggregate(pipeline);
    }
    async getRecurringPickups() {
        return await this.model.find({
            wasteType: "Commercial",
            frequency: { $in: ["Daily", "Weekly", "Monthly"] },
            parentRequestId: null,
            status: { $ne: "Cancelled" },
        });
    }
    async getLatestRecurringPickup(parentPickupId) {
        return await this.model
            .findOne({
            $or: [{ _id: parentPickupId }, { parentRequestId: parentPickupId }],
        })
            .sort({ originalPickupDate: -1 });
    }
    async existsRecurringPickup(parentPickupId, pickupDate) {
        const pickup = await this.model.exists({
            parentRequestId: parentPickupId,
            originalPickupDate: pickupDate,
        });
        return !!pickup;
    }
};
exports.PickupRepository = PickupRepository;
exports.PickupRepository = PickupRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object])
], PickupRepository);

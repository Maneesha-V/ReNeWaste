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
exports.WalletRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const walletModel_1 = require("../../models/wallet/walletModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const mongoose_1 = __importStar(require("mongoose"));
const dateUtils_1 = require("../../utils/dateUtils");
const mongodb_1 = require("mongodb");
const moment_1 = __importDefault(require("moment"));
let WalletRepository = class WalletRepository extends baseRepository_1.default {
    _userRepository;
    constructor(_userRepository) {
        super(walletModel_1.WalletModel);
        this._userRepository = _userRepository;
    }
    async findWallet(accountId, accountType, session) {
        const accountIdObj = new mongoose_1.Types.ObjectId(accountId);
        const query = this.model.findOne({
            accountId: accountIdObj,
            accountType,
        });
        if (session)
            query.session(session);
        return query;
    }
    async createWallet(payload) {
        console.log("🔥 Creating wallet", payload);
        const { accountId, accountType } = payload;
        return await this.model.create({
            accountId: new mongoose_1.Types.ObjectId(accountId),
            accountType,
            balance: 0,
            holdingBalance: 0,
            transactions: [],
        });
    }
    async findWalletByWalletId(walletId) {
        return await this.model.findOne({
            _id: walletId,
        });
    }
    async addMoney(payload, session) {
        const { walletId, data } = payload;
        return await this.model.findByIdAndUpdate(walletId, {
            $inc: { balance: data.amount },
            $push: {
                transactions: {
                    amount: data.amount,
                    description: data.description,
                    type: data.type,
                    subType: data.subType,
                    pickupReqId: new mongoose_1.Types.ObjectId(data.pickupReqId),
                    paidAt: new Date(),
                    status: "Paid",
                },
            },
        }, { new: true, session });
    }
    async createDrWpWallet(payload, session) {
        const { accountId, accountType, data } = payload;
        const [wallet] = await this.model.create([
            {
                accountId,
                accountType,
                balance: data?.amount || 0,
                transactions: data
                    ? [
                        {
                            amount: data.amount,
                            description: data.description,
                            type: data.type,
                            subType: data.subType,
                            pickupReqId: new mongoose_1.Types.ObjectId(data.pickupReqId),
                            paidAt: new Date(),
                            status: "Paid",
                        },
                    ]
                    : [],
            },
        ], session ? { session } : {});
        return wallet;
    }
    async paginatedWPGetWallet(payload) {
        const { walletId, page, limit, search } = payload;
        const skip = (page - 1) * limit;
        let searchMatch = {};
        if (search && search.trim() !== "") {
            const trimmed = search.trim();
            const amountNumber = Number(trimmed);
            const isAmount = !isNaN(amountNumber);
            if (isAmount) {
                searchMatch["transactions.amount"] = amountNumber;
            }
            else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
                const [d, m, y] = trimmed.split("-").map(Number);
                const start = new Date(y, m - 1, d, 0, 0, 0);
                const end = new Date(y, m - 1, d, 23, 59, 59);
                searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
            }
            else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
                const parsed = (0, moment_1.default)(trimmed, "DD-MM-YYYY HH:mm").toDate();
                const start = new Date(parsed.getTime() - 60000);
                const end = new Date(parsed.getTime() + 60000);
                searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
            }
            else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
                searchMatch["$expr"] = {
                    $eq: [
                        {
                            $dateToString: {
                                format: "%H:%M",
                                date: "$transactions.paidAt",
                                timezone: "Asia/Kolkata",
                            },
                        },
                        trimmed,
                    ],
                };
            }
            else {
                searchMatch = {
                    $or: [
                        { "transactions.description": { $regex: trimmed, $options: "i" } },
                        { "transactions.type": { $regex: trimmed, $options: "i" } },
                        { "transactions.status": { $regex: trimmed, $options: "i" } },
                    ],
                };
            }
        }
        const result = await this.model.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(walletId) } },
            { $unwind: "$transactions" },
            { $match: searchMatch },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { "transactions.paidAt": -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        { $replaceRoot: { newRoot: "$transactions" } },
                    ],
                    earnings: [
                        {
                            $match: {
                                "transactions.type": "Credit",
                                "transactions.subType": "SettlementEarning",
                                // "transactions.subType": "Settlement",
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalEarnings: { $sum: "$transactions.amount" },
                            },
                        },
                    ],
                },
            },
        ]);
        const total = result[0].metadata[0]?.total || 0;
        const transactions = result[0].data;
        const earnings = result[0].earnings[0]?.totalEarnings || 0;
        console.log("transactions", result[0]);
        return { transactions, total, earnings };
    }
    async paginatedDriverGetWallet(payload) {
        const { walletId, page, limit, search } = payload;
        const skip = (page - 1) * limit;
        let searchMatch = {};
        if (search && search.trim() !== "") {
            const trimmed = search.trim();
            const amountNumber = Number(trimmed);
            const isAmount = !isNaN(amountNumber);
            if (isAmount) {
                searchMatch["transactions.amount"] = amountNumber;
            }
            else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
                const [d, m, y] = trimmed.split("-").map(Number);
                const start = new Date(y, m - 1, d, 0, 0, 0);
                const end = new Date(y, m - 1, d, 23, 59, 59);
                searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
            }
            else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
                const parsed = (0, moment_1.default)(trimmed, "DD-MM-YYYY HH:mm").toDate();
                const start = new Date(parsed.getTime() - 60000);
                const end = new Date(parsed.getTime() + 60000);
                searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
            }
            else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
                searchMatch["$expr"] = {
                    $eq: [
                        {
                            $dateToString: {
                                format: "%H:%M",
                                date: "$transactions.paidAt",
                                timezone: "Asia/Kolkata",
                            },
                        },
                        trimmed,
                    ],
                };
            }
            else {
                searchMatch = {
                    $or: [
                        { "transactions.description": { $regex: trimmed, $options: "i" } },
                        { "transactions.type": { $regex: trimmed, $options: "i" } },
                        { "transactions.status": { $regex: trimmed, $options: "i" } },
                    ],
                };
            }
        }
        const result = await this.model.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(walletId) } },
            { $unwind: "$transactions" },
            { $match: searchMatch },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { "transactions.paidAt": -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        { $replaceRoot: { newRoot: "$transactions" } },
                    ],
                    rewards: [
                        {
                            $match: {
                                // "transactions.description": {$regex: "^Reward", $options: "i"}
                                "transactions.subType": "DriverEarning",
                                "transactions.type": "Credit",
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalRewards: { $sum: "$transactions.amount" },
                            },
                        },
                    ],
                },
            },
        ]);
        const total = result[0].metadata[0]?.total || 0;
        const transactions = result[0].data;
        const rewards = result[0].rewards[0]?.totalRewards || 0;
        console.log("transactions", result[0]);
        return { transactions, total, rewards };
    }
    async paginatedUserGetWallet(payload) {
        const { walletId, page, limit, search } = payload;
        const skip = (page - 1) * limit;
        let searchMatch = {};
        if (search && search.trim() !== "") {
            const trimmed = search.trim();
            const amountNumber = Number(trimmed);
            const isAmount = !isNaN(amountNumber);
            if (isAmount) {
                searchMatch["transactions.amount"] = amountNumber;
            }
            else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
                const [d, m, y] = trimmed.split("-").map(Number);
                const start = new Date(y, m - 1, d, 0, 0, 0);
                const end = new Date(y, m - 1, d, 23, 59, 59);
                searchMatch["$or"] = [
                    { "transactions.updatedAt": { $gte: start, $lte: end } },
                    { "transactions.paidAt": { $gte: start, $lte: end } },
                ];
            }
            else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
                const parsed = (0, moment_1.default)(trimmed, "DD-MM-YYYY HH:mm").toDate();
                const start = new Date(parsed.getTime() - 60000);
                const end = new Date(parsed.getTime() + 60000);
                searchMatch["$or"] = [
                    { "transactions.updatedAt": { $gte: start, $lte: end } },
                    { "transactions.paidAt": { $gte: start, $lte: end } },
                ];
            }
            else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
                searchMatch["$or"] = [
                    {
                        $expr: {
                            $eq: [
                                {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$transactions.updatedAt",
                                        timezone: "Asia/Kolkata",
                                    },
                                },
                                trimmed,
                            ],
                        },
                    },
                    {
                        $expr: {
                            $eq: [
                                {
                                    $dateToString: {
                                        format: "%H:%M",
                                        date: "$transactions.paidAt",
                                        timezone: "Asia/Kolkata",
                                    },
                                },
                                trimmed,
                            ],
                        },
                    },
                ];
            }
            else {
                searchMatch = {
                    $or: [
                        { "transactions.description": { $regex: trimmed, $options: "i" } },
                        { "transactions.type": { $regex: trimmed, $options: "i" } },
                        { "transactions.status": { $regex: trimmed, $options: "i" } },
                    ],
                };
            }
        }
        const result = await this.model.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(walletId) } },
            { $unwind: "$transactions" },
            // { $match: searchMatch },
            {
                $match: {
                    // "transactions.subType": "PickupPayment",
                    "transactions.subType": {
                        $in: ["PickupPayment", "UserDeposit"]
                    },
                    ...searchMatch,
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        {
                            // $sort: { "transactions.paidAt": -1 }
                            $sort: {
                                "transactions.updatedAt": -1,
                                "transactions.paidAt": -1,
                            },
                        },
                        { $skip: skip },
                        { $limit: limit },
                        { $replaceRoot: { newRoot: "$transactions" } },
                    ],
                },
            },
        ]);
        const total = result[0].metadata[0]?.total || 0;
        const transactions = result[0].data;
        console.log("transactions", result[0]);
        return { transactions, total };
    }
    async fetchFilteredWPRevenue(data) {
        const { plantId, filter, from, to } = data;
        const { start, end } = (0, dateUtils_1.getDateRange)(filter, from, to);
        const format = (0, dateUtils_1.getGroupFormat)(filter);
        console.log("data", data);
        console.log("st-en", start, end);
        const pipeline = [
            {
                $match: {
                    accountId: new mongodb_1.ObjectId(plantId),
                    accountType: "WastePlant",
                },
            },
            {
                $unwind: "$transactions",
            },
            {
                $match: {
                    "transactions.subType": "SettlementEarning",
                },
            },
        ];
        if (start && end) {
            pipeline.push({
                $match: {
                    "transactions.paidAt": {
                        $gte: start,
                        $lte: end,
                    },
                },
            });
        }
        // pipeline.push({
        //   $group: {
        //     _id: {
        //       $dateToString: {
        //         format,
        //         date: "$transactions.paidAt",
        //         timezone: "Asia/Kolkata"
        //       }
        //     },
        //     totalRevenue: { $sum: "$transactions.amount" },
        //   },
        // });
        // pipeline.push({
        //   $sort: { _id: 1 },
        // })
        // pipeline.push({
        //   $project: {
        //     _id: 0,
        //     date: "$_id",
        //     totalRevenue: 1
        //   }
        // })
        pipeline.push({
            $lookup: {
                from: "pickuprequests",
                localField: "transactions.pickupReqId",
                foreignField: "_id",
                as: "pickupData",
            },
        }, { $unwind: "$pickupData" }, {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format,
                            date: "$transactions.paidAt",
                            timezone: "Asia/Kolkata",
                        },
                    },
                    wasteType: "$pickupData.wasteType",
                },
                totalRevenue: { $sum: "$transactions.amount" },
            },
        }, { $sort: { "_id.date": 1 } }, {
            $project: {
                _id: 0,
                date: "$_id.date",
                wasteType: "$_id.wasteType",
                totalRevenue: 1,
            },
        });
        const result = await this.model.aggregate(pipeline);
        console.log("AGG RESULT:", result);
        const totalRevenue = await this.model.findOne({
            accountId: plantId,
            accountType: "WastePlant",
        });
        return {
            revenueTrends: result,
            wasteplantTotRevenue: totalRevenue?.balance ?? 0,
        };
    }
    async paginatedSuperAdminWallet(payload) {
        const { walletId, page, limit, search } = payload;
        const skip = (page - 1) * limit;
        let searchMatch = {};
        if (search && search.trim() !== "") {
            const trimmed = search.trim();
            const amountNumber = Number(trimmed);
            const isAmount = !isNaN(amountNumber);
            if (isAmount) {
                searchMatch["transactions.amount"] = amountNumber;
            }
            else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
                const [d, m, y] = trimmed.split("-").map(Number);
                const start = new Date(y, m - 1, d, 0, 0, 0);
                const end = new Date(y, m - 1, d, 23, 59, 59);
                searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
            }
            else if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}$/.test(trimmed)) {
                const parsed = (0, moment_1.default)(trimmed, "DD-MM-YYYY HH:mm").toDate();
                const start = new Date(parsed.getTime() - 60000);
                const end = new Date(parsed.getTime() + 60000);
                searchMatch["transactions.paidAt"] = { $gte: start, $lte: end };
            }
            else if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
                searchMatch["$expr"] = {
                    $eq: [
                        {
                            $dateToString: {
                                format: "%H:%M",
                                date: "$transactions.paidAt",
                                timezone: "Asia/Kolkata",
                            },
                        },
                        trimmed,
                    ],
                };
            }
            else {
                searchMatch = {
                    $or: [
                        { "transactions.description": { $regex: trimmed, $options: "i" } },
                        { "transactions.type": { $regex: trimmed, $options: "i" } },
                        { "transactions.status": { $regex: trimmed, $options: "i" } },
                    ],
                };
            }
        }
        const result = await this.model.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(walletId) } },
            { $unwind: "$transactions" },
            { $match: {
                    "transactions.subType": "SubscriptionPayment",
                    ...searchMatch
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { "transactions.paidAt": -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        { $replaceRoot: { newRoot: "$transactions" } },
                    ],
                },
            },
        ]);
        const total = result[0].metadata[0]?.total || 0;
        const transactions = result[0].data;
        console.log("transactions", result[0]);
        return { transactions, total };
    }
};
exports.WalletRepository = WalletRepository;
exports.WalletRepository = WalletRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __metadata("design:paramtypes", [Object])
], WalletRepository);

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
exports.PickupService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const PIckupReqMapper_1 = require("../../mappers/PIckupReqMapper");
const UserMapper_1 = require("../../mappers/UserMapper");
const mongoose_1 = __importDefault(require("mongoose"));
let PickupService = class PickupService {
    userRepository;
    pickupRepository;
    _walletRepository;
    _attendanceRepository;
    constructor(userRepository, pickupRepository, _walletRepository, _attendanceRepository) {
        this.userRepository = userRepository;
        this.pickupRepository = pickupRepository;
        this._walletRepository = _walletRepository;
        this._attendanceRepository = _attendanceRepository;
    }
    async getPickupRequestService(filters) {
        const result = await this.pickupRepository.getPickupsByDriverId(filters);
        return PIckupReqMapper_1.PickupRequestMapper.mapPickupReqsGetDTO(result);
    }
    async getPickupByIdForDriver(pickupReqId, driverId) {
        const pickup = await this.pickupRepository.findPickupByIdAndDriver(pickupReqId, driverId);
        console.log("pickup", pickup);
        return PIckupReqMapper_1.PickupRequestMapper.mapGetPickupReqDTO(pickup);
    }
    async updateAddressLatLngService(addressId, latitude, longitude) {
        const updatedUser = await this.userRepository.updateAddressByIdLatLng(addressId, latitude, longitude);
        const updatedAddress = updatedUser.addresses.id(addressId);
        if (!updatedAddress) {
            throw new Error("Updated address not found");
        }
        return UserMapper_1.UserMapper.mapAddressDTO(updatedAddress);
    }
    async updateTrackingStatus(pickupReqId, trackingStatus) {
        const pickup = await this.pickupRepository.updateTrackingStatus(pickupReqId, trackingStatus);
        return PIckupReqMapper_1.PickupRequestMapper.mapPickupReqDTO(pickup);
    }
    // async markPickupCompletedService(
    //   pickupReqId: string,
    // ): Promise<MarkPickupCompletedResp> {
    //   const pickup =
    //     await this.pickupRepository.markPickupCompletedStatus(pickupReqId);
    //   if (!pickup) {
    //     throw new Error("Not mark pickup.");
    //   }
    //   const amount = pickup.payment.amount;
    //   const driverId = pickup.driverId!.toString();
    //   const wasteplantId = pickup.wasteplantId!.toString();
    //   const driverShare = amount * 0.3;
    //   const wasteplantShare = amount * 0.7;
    //   const driverWalet = await this._walletRepository.findWallet(
    //     driverId,
    //     "Driver",
    //   );
    //   if (!driverWalet) {
    //     await this._walletRepository.createDrWpWallet({
    //       accountId: driverId,
    //       accountType: "Driver",
    //       data: {
    //         amount: driverShare,
    //         description: `Reward for completed pickup ${pickup.pickupId}`,
    //         type: "Reward",
    //       },
    //     });
    //   } else {
    //     await this._walletRepository.addMoney({
    //       walletId: driverWalet._id!.toString(),
    //       data: {
    //         amount: driverShare,
    //         description: `Reward for completed pickup ${pickup.pickupId}`,
    //         type: "Reward",
    //       },
    //     });
    //   }
    //   const wasteplantWallet = await this._walletRepository.findWallet(
    //     wasteplantId,
    //     "WastePlant",
    //   );
    //   if (!wasteplantWallet) {
    //     await this._walletRepository.createDrWpWallet({
    //       accountId: wasteplantId,
    //       accountType: "WastePlant",
    //       data: {
    //         amount: wasteplantShare,
    //         type: "Earning",
    //         description: `Earnings from completed pickup ${pickup.pickupId}`,
    //       },
    //     });
    //   } else {
    //     await this._walletRepository.addMoney({
    //       walletId: wasteplantWallet._id.toString(),
    //       data: {
    //         amount: wasteplantShare,
    //         type: "Earning",
    //         description: `Income from completed pickup ${pickup.pickupId}`,
    //       },
    //     });
    //   }
    //   const attendance = await this._attendanceRepository.findDriverAttendance({
    //     truckId: pickup.truckId!.toString(),
    //     plantId: wasteplantId,
    //     driverId,
    //   });
    //   if (!attendance) {
    //     throw new Error("Driver attendance not found.");
    //   }
    //   attendance.totalPickups += 1;
    //   attendance.reward += driverShare;
    //   attendance.earning += wasteplantShare;
    //   await attendance.save();
    //   return {
    //     pickupReqId: pickup._id.toString(),
    //     status: pickup.status,
    //   };
    // }
    async markPickupCompletedService(pickupReqId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const pickup = await this.pickupRepository.markPickupCompletedStatus(pickupReqId, session);
            if (!pickup) {
                throw new Error("Not mark pickup.");
            }
            if (!pickup.payment || pickup.payment.status !== "Paid") {
                throw new Error("Pickup payment not completed");
            }
            if (pickup.payment.payoutStatus === "Completed") {
                throw new Error("Payout already released");
            }
            const amount = pickup.payment.amount;
            const userWallet = await this._walletRepository.findWallet(pickup.userId.toString(), "User", session);
            if (!userWallet) {
                throw new Error("User wallet not found");
            }
            if (userWallet.holdingBalance < amount) {
                throw new Error("Insufficient holding balance");
            }
            const pickupTransaction = userWallet.transactions.find((tx) => tx.pickupReqId?.toString() === pickup._id.toString() &&
                tx.subType === "PickupPayment");
            if (!pickupTransaction) {
                throw new Error("Pickup payment transaction not found");
            }
            if (pickupTransaction.settlementStatus === "Completed") {
                throw new Error("Already settled");
            }
            userWallet.holdingBalance -= amount;
            pickupTransaction.settlementStatus = "Completed";
            userWallet.transactions.push({
                type: "Debit",
                subType: "Settlement",
                pickupReqId: pickup._id,
                amount,
                description: `Pickup ${pickup.pickupId} payment settled`,
                status: "Paid",
                paidAt: new Date(),
            });
            await userWallet.save({ session });
            const driverId = pickup.driverId.toString();
            const wasteplantId = pickup.wasteplantId.toString();
            const driverShare = amount * 0.3;
            const wasteplantShare = amount * 0.7;
            const driverWalet = await this._walletRepository.findWallet(driverId, "Driver", session);
            if (!driverWalet) {
                await this._walletRepository.createDrWpWallet({
                    accountId: driverId,
                    accountType: "Driver",
                    data: {
                        amount: driverShare,
                        description: `Reward for completed pickup ${pickup.pickupId}`,
                        type: "Credit",
                        subType: "DriverEarning",
                        pickupReqId: pickup._id.toString(),
                    },
                }, session);
            }
            else {
                await this._walletRepository.addMoney({
                    walletId: driverWalet._id.toString(),
                    data: {
                        amount: driverShare,
                        description: `Reward for completed pickup ${pickup.pickupId}`,
                        type: "Credit",
                        subType: "DriverEarning",
                        pickupReqId: pickup._id.toString(),
                        status: "Paid",
                        paidAt: new Date(),
                    },
                }, session);
            }
            const wasteplantWallet = await this._walletRepository.findWallet(wasteplantId, "WastePlant", session);
            if (!wasteplantWallet) {
                await this._walletRepository.createDrWpWallet({
                    accountId: wasteplantId,
                    accountType: "WastePlant",
                    data: {
                        amount: wasteplantShare,
                        type: "Credit",
                        description: `Earnings from completed pickup ${pickup.pickupId}`,
                        subType: "SettlementEarning",
                        pickupReqId: pickup._id.toString(),
                    },
                }, session);
            }
            else {
                await this._walletRepository.addMoney({
                    walletId: wasteplantWallet._id.toString(),
                    data: {
                        amount: wasteplantShare,
                        type: "Credit",
                        description: `Earnings from completed pickup ${pickup.pickupId}`,
                        subType: "SettlementEarning",
                        pickupReqId: pickup._id.toString(),
                        status: "Paid",
                        paidAt: new Date(),
                    },
                }, session);
            }
            const attendance = await this._attendanceRepository.findDriverAttendance({
                truckId: pickup.truckId.toString(),
                plantId: wasteplantId,
                driverId,
            }, session);
            if (!attendance) {
                throw new Error("Driver attendance not found.");
            }
            attendance.totalPickups = (attendance.totalPickups || 0) + 1;
            attendance.reward = (attendance.reward || 0) + driverShare;
            attendance.wpEarning = (attendance.wpEarning || 0) + wasteplantShare;
            await attendance.save({ session });
            pickup.payment.payoutStatus = "Completed";
            pickup.payment.payoutAt = new Date();
            pickup.markModified("payment");
            await pickup.save({ session });
            await session.commitTransaction();
            session.endSession();
            console.log("attendance", attendance);
            return {
                pickupReqId: pickup._id.toString(),
                status: pickup.status,
            };
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
};
exports.PickupService = PickupService;
exports.PickupService = PickupService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.WalletRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.AttendanceRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], PickupService);

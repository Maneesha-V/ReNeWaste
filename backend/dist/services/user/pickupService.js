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
let PickupService = class PickupService {
    _pickupRepository;
    _notificationRepository;
    _walletRepository;
    constructor(_pickupRepository, _notificationRepository, _walletRepository) {
        this._pickupRepository = _pickupRepository;
        this._notificationRepository = _notificationRepository;
        this._walletRepository = _walletRepository;
    }
    async getPickupPlanService(userId, paginationData) {
        const { pickupPlans, total } = await this._pickupRepository.getPickupPlansByUserId(userId, paginationData);
        // console.log("pickupPlans",pickupPlans);
        if (!pickupPlans || pickupPlans.length === 0) {
            throw new Error("No pickup plans found");
        }
        return {
            pickups: PIckupReqMapper_1.PickupRequestMapper.mapToPickupPlansDTO(pickupPlans),
            total,
        };
    }
    async cancelPickupPlanService(pickupReqId) {
        const pickup = await this._pickupRepository.getPickupById(pickupReqId);
        if (!pickup) {
            throw new Error("Pickup not found");
        }
        if (pickup.status === "Cancelled") {
            throw new Error("Pickup already canceled");
        }
        const updated = await this._pickupRepository.updatePickupStatus(pickupReqId, "Cancelled");
        return !!updated;
    }
    async cancelPickupReasonRequest(data) {
        const updatedPickupRequest = await this._pickupRepository.updatePaymentStatus(data.pickupReqId);
        if (!updatedPickupRequest)
            throw new Error("Pickup not updated.");
        if (updatedPickupRequest.payment?.payoutStatus === "Completed") {
            throw new Error("Refund not allowed after payout released.");
        }
        if (!updatedPickupRequest.wasteplantId) {
            throw new Error("Wasteplant ID not found in pickup request.");
        }
        const userWallet = await this._walletRepository.findWallet(data.userId, "User");
        if (!userWallet) {
            throw new Error("User wallet not found.");
        }
        const cancelPickupTransaction = userWallet.transactions.find((tx) => tx.subType === "PickupPayment" &&
            tx.pickupReqId?.toString() === data.pickupReqId);
        if (!cancelPickupTransaction)
            throw new Error("Pickup payment transaction not found.");
        if (cancelPickupTransaction.status !== "Paid") {
            throw new Error("Payment not completed. Refund not allowed.");
        }
        if (cancelPickupTransaction.refundRequested) {
            throw new Error("Refund already requested.");
        }
        if (userWallet.holdingBalance < cancelPickupTransaction.amount) {
            throw new Error("Refund cannot be processed. Amount already settled.");
        }
        cancelPickupTransaction.refundRequested = true;
        cancelPickupTransaction.refundStatus = "Pending";
        await userWallet.save();
        const io = globalThis.io;
        const plantId = updatedPickupRequest?.wasteplantId.toString();
        const userMessage = `PickupID ${updatedPickupRequest.pickupId} is requested with refund.${data.reason}`;
        const plantNotification = await this._notificationRepository.createNotification({
            receiverId: plantId,
            receiverType: "wasteplant",
            senderId: data.userId,
            senderType: "user",
            message: userMessage,
            type: "pickup_refund-req",
        });
        if (io) {
            io.to(`${plantId}`).emit("newNotification", plantNotification);
        }
        return PIckupReqMapper_1.PickupRequestMapper.mapPayment(updatedPickupRequest?.payment);
    }
};
exports.PickupService = PickupService;
exports.PickupService = PickupService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.NotificationRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], PickupService);

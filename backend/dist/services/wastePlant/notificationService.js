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
exports.NotificationService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const NotificationMapper_1 = require("../../mappers/NotificationMapper");
let NotificationService = class NotificationService {
    notificationRepository;
    wasteCollectionRepository;
    pickupRepository;
    constructor(notificationRepository, wasteCollectionRepository, pickupRepository) {
        this.notificationRepository = notificationRepository;
        this.wasteCollectionRepository = wasteCollectionRepository;
        this.pickupRepository = pickupRepository;
    }
    async getNotifications(wasteplantId) {
        const notifications = await this.notificationRepository.findByReceiverId(wasteplantId);
        if (!notifications) {
            throw new Error("Notification not found.");
        }
        return NotificationMapper_1.NotificationMapper.mapNotificationsDTO(notifications);
    }
    async markNotificationAsRead(notifId, plantId) {
        const notification = await this.notificationRepository.markAsReadById(notifId);
        if (!notification || !notification.message) {
            throw new Error("Notification not found.");
        }
        if (notification.senderType === "user" &&
            notification.type === "pickup_refund-req") {
            const extractPickupId = notification.message.split(" ");
            const pickupId = extractPickupId[1];
            const pickupReq = await this.pickupRepository.getPickupWithUserAndPlantId(plantId, notification.senderId.toString(), pickupId);
            if (!pickupReq) {
                throw new Error("PickupRequest not found.");
            }
            pickupReq.payment.refundStatus = "Pending";
            await pickupReq.save();
            const io = globalThis.io;
            const userId = pickupReq.userId.toString();
            const userMessage = `Pickup ID ${pickupReq.pickupId} refund request is under review.`;
            const userNotification = await this.notificationRepository.createNotification({
                receiverId: userId,
                receiverType: "user",
                senderId: plantId,
                senderType: "wasteplant",
                message: userMessage,
                type: "pickup_refund-pending",
            });
            console.log("userNotification", userNotification);
            if (io) {
                io.to(`${userId}`).emit("newNotification", userNotification);
            }
        }
        return NotificationMapper_1.NotificationMapper.mapNotificationDTO(notification);
    }
    async saveWasteMeasurement(data) {
        return await this.wasteCollectionRepository.createWasteMeasurement(data);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.NotificationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.WasteCollectionRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.PickupRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], NotificationService);

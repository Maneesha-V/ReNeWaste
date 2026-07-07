"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const notificationModel_1 = require("../models/notification/notificationModel");
const sendNotification = async ({ receiverId, receiverType, senderId, senderType, message, type, }) => {
    try {
        const io = globalThis.io;
        const notification = await notificationModel_1.NotificationModel.create({
            receiverId,
            receiverType,
            senderId,
            senderType,
            message,
            type,
        });
        if (io) {
            io.to(`${receiverId}`).emit("notification", notification);
        }
        else {
            console.warn("⚠️ Socket.IO instance not available, skipping real-time push");
        }
        console.log(`📩 Notification sent to receiver ${receiverId}`);
        return notification;
    }
    catch (err) {
        console.error("❌ Error sending notification:", err);
    }
};
exports.sendNotification = sendNotification;

import { NotificationModel } from "../models/notification/notificationModel";

interface NotificationData {
  receiverId: string;
  receiverType: string;
  senderId: string;
  senderType: string;
  message: string;
  type: string;
}

export const sendNotification = async ({
  receiverId,
  receiverType,
  senderId,
  senderType,
  message,
  type,
}: NotificationData) => {
  try {
    const io = global.io;

    const notification = await NotificationModel.create({
      receiverId,
      receiverType,
      senderId,
      senderType,
      message,
      type,
    });

    if (io) {
      io.to(`${receiverId}`).emit("notification", notification);
    } else {
      console.warn("⚠️ Socket.IO instance not available, skipping real-time push");
    }
    console.log(`📩 Notification sent to receiver ${receiverId}`);
    return notification;
  } catch (err) {
    console.error("❌ Error sending notification:", err);
  }
};

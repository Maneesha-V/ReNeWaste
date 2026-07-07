"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = socketHandler;
const chatMessageModel_1 = require("../models/chat/chatMessageModel");
const driverModel_1 = require("../models/driver/driverModel");
const userModel_1 = require("../models/user/userModel");
const wastePlantModel_1 = require("../models/wastePlant/wastePlantModel");
const superAdminModel_1 = require("../models/superAdmin/superAdminModel");
async function findRoleById(id) {
    const [driver, user, wasteplant, superadmin] = await Promise.all([
        driverModel_1.DriverModel.findById(id).select("_id").lean(),
        userModel_1.UserModel.findById(id).select("_id").lean(),
        wastePlantModel_1.WastePlantModel.findById(id).select("_id").lean(),
        superAdminModel_1.SuperAdminModel.findById(id).select("_id").lean(),
    ]);
    if (driver)
        return "driver";
    if (user)
        return "user";
    if (wasteplant)
        return "wasteplant";
    if (superadmin)
        return "superadmin";
    return null;
}
function socketHandler(socket, io) {
    // Join room based on conversationId
    socket.on("joinChatRoom", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined room: ${conversationId}`);
    });
    socket.on("sendMessage", async (data) => {
        try {
            const { senderId, receiverId, text, conversationId } = data;
            const [senderRole, receiverRole] = await Promise.all([
                findRoleById(senderId),
                findRoleById(receiverId),
            ]);
            if (!senderRole || !receiverRole) {
                console.error("Could not determine sender or receiver role");
                return;
            }
            const message = new chatMessageModel_1.ChatMessageModel({
                senderId,
                senderRole,
                receiverId,
                receiverRole,
                text,
                conversationId,
            });
            await message.save();
            io.to(conversationId).emit("receiveMessage", message);
        }
        catch (error) {
            console.error("Error saving message:", error);
        }
    });
    socket.on("joinPickupRoom", (pickupReqId) => {
        socket.join(pickupReqId);
        console.log(`Socket ${socket.id} joined pickup room: ${pickupReqId}`);
    });
    socket.on("joinNotificationRoom", (plantId) => {
        // const roomName = `notif_${plantId}`;
        socket.join(plantId);
        console.log(`Socket ${socket.id} joined notification room: ${plantId}`);
    });
    // Real-time location update from driver
    socket.on("driverLocationUpdate", ({ pickupReqId, latitude, longitude }) => {
        console.log("📍 Driver location update:", {
            pickupReqId,
            latitude,
            longitude,
        });
        if (!pickupReqId || !latitude || !longitude) {
            console.error("Invalid driver location update payload");
            return;
        }
        // Send only to users in this pickup room
        socket
            .to(pickupReqId)
            .emit("driverLocationBroadcast", { latitude, longitude });
        io.to(pickupReqId).emit("trackingStatusUpdated", "InTransit");
        socket.on("pickupCompleted", ({ pickupReqId, message }) => {
            console.log(`✅ Pickup ${pickupReqId} completed: ${message}`);
            io.to(pickupReqId).emit("pickupCompleteBroadcast", { pickupReqId });
        });
    });
    socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
}

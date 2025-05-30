import { Server, Socket } from "socket.io";
import { ChatMessageModel } from "../models/chat/chatMessageModel";
import { DriverModel } from "../models/driver/driverModel";
import { UserModel } from "../models/user/userModel";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { SuperAdminModel } from "../models/superAdmin/superAdminModel";
import { ChatMessage } from "../types/common/socketTypes";

async function findRoleById(id: string): Promise<string | null> {
  const [driver, user, wasteplant, superadmin] = await Promise.all([
    DriverModel.findById(id).select("_id").lean(),
    UserModel.findById(id).select("_id").lean(),
    WastePlantModel.findById(id).select("_id").lean(),
    SuperAdminModel.findById(id).select("_id").lean(),
  ]);

  if (driver) return "driver";
  if (user) return "user";
  if (wasteplant) return "wasteplant";
  if (superadmin) return "superadmin";

  return null;
}

export default function socketHandler(socket: Socket, io: Server) {
  // Join room based on conversationId
  socket.on("joinRoom", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("sendMessage", async (data: ChatMessage) => {
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
      const message = new ChatMessageModel({
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        text,
        conversationId,
      });

      await message.save();

      io.to(conversationId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  socket.on("joinPickupRoom", (pickupReqId: string) => {
    socket.join(pickupReqId);
    console.log(`Socket ${socket.id} joined pickup room: ${pickupReqId}`);
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

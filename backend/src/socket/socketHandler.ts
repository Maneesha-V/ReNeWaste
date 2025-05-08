import { Server, Socket } from "socket.io";
import { ChatMessageModel } from "../models/chat/chatMessageModel";
import { DriverModel } from "../models/driver/driverModel";
import { UserModel } from "../models/user/userModel";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { SuperAdminModel } from "../models/superAdmin/superAdminModel";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  text: string;
  conversationId: string;
}

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

  // Listen for message and emit to that room
  // socket.on("sendMessage", (data: ChatMessage) => {
  //   console.log("📩 Message received:", data);
  //   io.to(data.conversationId).emit("receiveMessage", data);
  // });
  socket.on("sendMessage", async (data: ChatMessage) => {
    try {
      const { senderId, receiverId, text, conversationId } = data;

      const [senderRole, receiverRole] = await Promise.all([
        findRoleById(senderId),
        findRoleById(receiverId)
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
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
}

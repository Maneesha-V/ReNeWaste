import { Server, Socket } from "socket.io";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  text: string;
  conversationId: string;
}

export default function socketHandler(socket: Socket, io: Server) {
  // Join room based on conversationId
  socket.on("joinRoom", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room: ${conversationId}`);
  });

  // Listen for message and emit to that room
  socket.on("sendMessage", (data: ChatMessage) => {
    console.log("📩 Message received:", data);
    io.to(data.conversationId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
}

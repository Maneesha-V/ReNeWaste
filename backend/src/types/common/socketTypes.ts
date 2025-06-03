import { Server } from "socket.io";

declare global {
  var io: Server | undefined;
}

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  text: string;
  conversationId: string;
}
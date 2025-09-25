import mongoose, { Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  senderRole: "driver" | "user" | "wasteplant" | "superadmin";
  receiverId: mongoose.Types.ObjectId;
  receiverRole: "driver" | "user" | "wasteplant" | "superadmin";
  text: string;
  conversationId: mongoose.Types.ObjectId;
  createdAt: Date;
}
export interface IChatMessageDocument extends IChatMessage, Document {
  _id: Types.ObjectId;
}

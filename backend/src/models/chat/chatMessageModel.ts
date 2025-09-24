import { model } from "mongoose";
import { IChatMessageDocument } from "./interfaces/chatMessageInterface";
import { chatMessageSchema } from "./chatMessageSchema";

export const ChatMessageModel = model<IChatMessageDocument>(
  "ChatMessage",
  chatMessageSchema,
);

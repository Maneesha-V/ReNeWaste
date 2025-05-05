import { model } from "mongoose";
import { chatMessageSchema } from "./ChatMessageSchema";
import { IChatMessageDocument } from "./interfaces/chatMessageInterface";

export const ChatMessageModel =  model<IChatMessageDocument>('ChatMessage', chatMessageSchema);
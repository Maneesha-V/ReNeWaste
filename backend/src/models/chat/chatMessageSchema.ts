import mongoose, { Schema } from "mongoose";
import { IChatMessageDocument } from "./interfaces/chatMessageInterface";

export const chatMessageSchema: Schema<IChatMessageDocument> = new Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "senderRole", // dynamic ref to driver/user/etc.
      },
      senderRole: {
        type: String,
        required: true,
        enum: ["driver", "user", "wasteplant", "superadmin"],
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverRole",
      },
      receiverRole: {
        type: String,
        required: true,
        enum: ["driver", "user", "wasteplant", "superadmin"],
      },
      text: {
        type: String,
        required: true,
      },
      conversationId: {
        type: String,
        required: true,
        index: true, 
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );
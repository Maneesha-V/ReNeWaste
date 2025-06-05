import mongoose, { Schema } from "mongoose";
import { INotificationDocument } from "./interfaces/notificationInterface";

export const NotificationSchema: Schema<INotificationDocument> = new Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverType: {
      type: String,
      enum: ["wasteplant", "superadmin", "driver", "user"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["pickup_scheduled", "truck_returned", "general", "pickup_requested", "weight_measured","pickup_rescheduled"],
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
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

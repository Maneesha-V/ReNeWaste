import { model } from "mongoose";
import { INotificationDocument } from "./interfaces/notificationInterface";
import { NotificationSchema } from "./notificationSchema";

export const NotificationModel = model<INotificationDocument>(
  "Notification",
  NotificationSchema,
);

import mongoose, { Types, Document } from "mongoose";

type Role = "wasteplant" | "superadmin" | "driver" | "user";

export type NotificationType =
  | "pickup_scheduled"
  | "truck_returned"
  | "general"
  | "pickup_requested"
  | "pickup_approved"
  | "pickup_rescheduled"
  | "pickup_cancelled"
  | "pickup_refund-req"
  | "pickup_modify-req"
  | "pickup_modify-approve"
  | "pickup_modify-reject"
  | "subscribe_reminder"
  | "subscribe_recharged"
  | "renew_reminder"
  | "recharge_reminder";

export interface INotification {
  receiverId: mongoose.Types.ObjectId;
  receiverType: Role;
  senderId: mongoose.Types.ObjectId;
  senderType: Role;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  createdAt?: Date;
  isMeasured: boolean;
  pickupRequestId?: mongoose.Types.ObjectId;
}

export interface INotificationDocument extends INotification, Document {
  _id: Types.ObjectId;
}

export type CreateNotificationReq = {
  receiverId: string;
  receiverType: Role;
  senderId: string;
  senderType: Role;
  message: string;
  type: string;
  pickupRequestId?: string;
};
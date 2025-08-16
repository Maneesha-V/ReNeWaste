import mongoose, { Types, Document } from "mongoose";

type Role = 'wasteplant' | 'superadmin' | 'driver' | 'user';

export type NotificationType =
  | 'pickup_scheduled'
  | 'truck_returned'
  | 'general'
  | 'pickup_requested'
  | 'pickup_approved'
  | 'pickup_rescheduled'
  | 'pickup_cancelled'
  | "pickup_refund-req"
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
}

export interface INotificationDocument extends INotification, Document {
  _id: Types.ObjectId;
}
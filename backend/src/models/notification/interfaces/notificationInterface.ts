import mongoose, { Types, Document } from "mongoose";

type Role = 'wasteplant' | 'superadmin' | 'driver' | 'user';

type NotificationType =
  | 'pickup_scheduled'
  | 'truck_returned'
  | 'general'
  | 'pickup_requested'
  | 'pickup_approved'
  | 'pickup_rescheduled'
  | 'pickup_cancelled'
  | "pickup_refund-req";

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
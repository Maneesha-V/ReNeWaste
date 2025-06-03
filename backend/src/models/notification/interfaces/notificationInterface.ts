import mongoose, { Types, Document } from "mongoose";

export interface INotification {
  receiverId: mongoose.Types.ObjectId;
  receiverType: 'wasteplant' | 'superadmin' | 'driver' | 'user';
  message: string;
  type: string;
  isRead?: boolean;
  createdAt?: Date;
}

export interface INotificationDocument extends INotification, Document {
  _id: Types.ObjectId;
}
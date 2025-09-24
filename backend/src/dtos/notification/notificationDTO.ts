import { NotificationType } from "../../models/notification/interfaces/notificationInterface";
import { BaseDTO } from "../base/BaseDTO";
import { Role } from "../user/userDTO";

export interface NotificationDTO extends BaseDTO {
  receiverId: string;
  receiverType: Role;
  senderId: string;
  senderType: Role;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  createdAt?: Date;
}
export type notificationPayload = {
  plantId: string;
  adminId: string;
};
export type RoleType = "wasteplant" | "user" | "driver" | "superadmin";

export type CreateNotificationDTO = {
  receiverId: string;
  receiverType: RoleType;
  senderId: string,
  senderType: RoleType,
  message: string;
  type: string;
};
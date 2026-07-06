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
  isMeasured: boolean;
}
export type notificationPayload = {
  plantId: string;
  adminId: string;
};
export type RoleType = "wasteplant" | "user" | "driver" | "superadmin";



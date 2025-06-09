export type RoleType = "wasteplant" | "user" | "driver" | "superadmin";

export type CreateNotificationDTO = {
  receiverId: string;
  receiverType: RoleType;
  senderId: string,
  senderType: RoleType,
  message: string;
  type: string;
};


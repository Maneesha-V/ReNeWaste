export type ReceiverType = "wasteplant" | "user" | "driver" | "superadmin";

export type CreateNotificationDTO = {
  receiverId: string;
  receiverType: ReceiverType;
  message: string;
  type: string;
};


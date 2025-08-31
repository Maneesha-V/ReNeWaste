import { BaseDTO } from "../base/BaseDTO";
import { Role } from "../user/userDTO";

export interface ChatMessageDTO extends BaseDTO {
  senderId: string;
  senderRole: Role;
  receiverId: string;
  receiverRole: Role;
  text: string;
  conversationId: string;
  createdAt: Date;
}

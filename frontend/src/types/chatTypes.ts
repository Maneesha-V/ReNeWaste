export type Message = {
    senderRole:string;
    sender: string;
    text: string;
    conversationId: string;
  }
  type Role = "driver" | "user" | "wasteplant" | "superadmin";
  
  export type ConversationIdPayload = {
    senderId: string;
    senderRole: Role;
    receiverId: string;
    receiverRole: Role;
  }
  export type MessagesPayload = {
    conversationId: string;
  }
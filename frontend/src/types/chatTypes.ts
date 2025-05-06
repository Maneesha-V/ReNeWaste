export interface Message {
    sender: string;
    text: string;
    conversationId: string;
  }
  export interface ConversationIdPayload {
    senderId: string;
    senderRole: "driver" | "user" | "wasteplant" | "superadmin";
    receiverId: string;
    receiverRole: "driver" | "user" | "wasteplant" | "superadmin";
  }
  
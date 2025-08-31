export type ConversationIdPayload = {
    senderId: string;
    senderRole: string;
    receiverId: string;
    receiverRole: string;
}
export type fetchConversationIdResp = {
    success: boolean;
    conversationId: string;
}
export type MessagesPayload = {
 conversationId: string;
}
export type fetchChatMessagesResp = {
    messages: MessagesResp[];
}
export type MessagesResp = {
  senderId: string;
  senderRole: string;
  receiverId: string;
  receiverRole: string;
  text: string;
  conversationId: string;
  createdAt: Date;
}
export type Message = MessagesResp & {
    // senderRole:string;
    sender: string;
    // text: string;
    // conversationId: string;
  }
import { axiosDriver } from "../../config/axiosClients";
import { ConversationIdPayload, MessagesPayload } from "../../types/chatTypes";

export const getConversationId = async (payload: ConversationIdPayload) => {
    const response = await axiosDriver.post(`/conversation`, payload);
      return response.data.conversationId;
};
export const getChatMessages = async (payload: MessagesPayload) => {
  const response = await axiosDriver.post(`/chat-messages`, payload);
    return response.data.messages;
};
import { axiosWasteplant } from "../../config/axiosClients";
import { ConversationIdPayload, MessagesPayload } from "../../types/chat/chatMessageType";

export const getConversationId = async (payload: ConversationIdPayload) => {
    const response = await axiosWasteplant.post(`/conversation`, payload);
      return response.data;
};
export const getChatMessages = async (payload: MessagesPayload) => {
  const response = await axiosWasteplant.post(`/chat-messages`, payload);
    return response.data;
};

import axiosWasteplant from "../../api/axiosWasteplant";
import { ConversationIdPayload, MessagesPayload } from "../../types/chatTypes";

export const getConversationId = async (payload: ConversationIdPayload) => {
    const response = await axiosWasteplant.post(`/conversation`, payload);
      return response.data.conversationId;
};
export const getChatMessages = async (payload: MessagesPayload) => {
  const response = await axiosWasteplant.post(`/chat-messages`, payload);
    return response.data.messages;
};

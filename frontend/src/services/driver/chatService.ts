import axiosDriver from "../../api/axiosDriver";
import { ConversationIdPayload } from "../../types/chatTypes";

export const getConversationId = async (payload: ConversationIdPayload) => {
    const response = await axiosDriver.post(`/conversation`, payload);
      return response.data.conversationId;
};

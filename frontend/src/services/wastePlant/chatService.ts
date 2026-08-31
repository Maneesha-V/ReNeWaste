import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { ConversationIdPayload, MessagesPayload } from "../../types/chat/chatMessageType";

export const getConversationId = async (payload: ConversationIdPayload) => {
    const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.CONVERSATION, payload);
      return response.data;
};
export const getChatMessages = async (payload: MessagesPayload) => {
  const response = await axiosWasteplant.post(API_ROUTES.WASTE_PLANT.CHAT_MESSAGES, payload);
    return response.data;
};

import { axiosDriver } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { ConversationIdPayload, MessagesPayload } from "../../types/chat/chatMessageType";


export const getConversationId = async (payload: ConversationIdPayload) => {
    const response = await axiosDriver.post(API_ROUTES.DRIVER.CONVERSATION, payload);
      return response.data;
};
export const getChatMessages = async (payload: MessagesPayload) => {
  const response = await axiosDriver.post(API_ROUTES.DRIVER.CHAT_MESSAGES, payload);
    return response.data;
};
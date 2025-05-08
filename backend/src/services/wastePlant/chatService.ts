import { IChatService } from "./interface/IChatService";
import ConversationRepository from "../../repositories/chat/conversationRepository";
import ChatMsgRepository from "../../repositories/chat/chatMsgRepository";
import { ParticipantRole } from "../../models/chat/interfaces/conversationInterface";

class ChatService implements IChatService {
  async getOrCreateConversationId(
    senderId: string,
    senderRole: ParticipantRole,
    receiverId: string,
    receiverRole: ParticipantRole
  ): Promise<string> {
    let conversation =
      await ConversationRepository.findConversationByParticipants(
        senderId,
        receiverId
      );

    if (!conversation) {
      conversation = await ConversationRepository.createConversation(
        senderId,
        senderRole,
        receiverId,
        receiverRole
      );
    }

    return conversation._id.toString();
  }
  async getChatMessageService(conversationId: string){
    return await ChatMsgRepository.findChatMsgByConversationId(conversationId)
  }
}
export default new ChatService();

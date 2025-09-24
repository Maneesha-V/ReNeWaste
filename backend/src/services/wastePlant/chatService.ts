import { IChatService } from "./interface/IChatService";
import { ParticipantRole } from "../../models/chat/interfaces/conversationInterface";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IChatMsgRepository } from "../../repositories/chat/interface/IChatMsgRepository";
import { IConversationRepository } from "../../repositories/chat/interface/IConversation";
import { ChatMessageMapper } from "../../mappers/ChatMessageMapper";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatMsgRepository)
    private chatMsgRepository: IChatMsgRepository,
    @inject(TYPES.ConversationRepository)
    private convestnRepository: IConversationRepository,
  ) {}
  async getOrCreateConversationId(
    senderId: string,
    senderRole: ParticipantRole,
    receiverId: string,
    receiverRole: ParticipantRole,
  ): Promise<string> {
    let conversation =
      await this.convestnRepository.findConversationByParticipants(
        senderId,
        receiverId,
      );

    if (!conversation) {
      conversation = await this.convestnRepository.createConversation(
        senderId,
        senderRole,
        receiverId,
        receiverRole,
      );
    }

    return conversation._id.toString();
  }
  async getChatMessageService(conversationId: string) {
    const chatMessages =
      await this.chatMsgRepository.findChatMsgByConversationId(conversationId);
    return ChatMessageMapper.mapChatMessagesDTO(chatMessages);
  }
}

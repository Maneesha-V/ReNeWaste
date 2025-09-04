import { inject, injectable } from "inversify";
import { IChatService } from "./interface/IChatService";
import { ParticipantRole } from "../../models/chat/interfaces/conversationInterface";
import TYPES from "../../config/inversify/types";
import { IConversationRepository } from "../../repositories/chat/interface/IConversation";
import { IChatMsgRepository } from "../../repositories/chat/interface/IChatMsgRepository";
import { ChatMessageMapper } from "../../mappers/ChatMessageMapper";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ConversationRepository)
    private converstnRepo: IConversationRepository,
    @inject(TYPES.ChatMsgRepository)
    private chatMsgRepository: IChatMsgRepository
  ){}
  async getOrCreateConversationId(
    senderId: string,
    senderRole: ParticipantRole,
    receiverId: string,
    receiverRole: ParticipantRole
  ): Promise<string> {
    let conversation =
      await this.converstnRepo.findConversationByParticipants(
        senderId,
        receiverId
      );

    if (!conversation) {
      conversation = await this.converstnRepo.createConversation(
        senderId,
        senderRole,
        receiverId,
        receiverRole
      );
    }

    return conversation._id.toString();
  }
  async getChatMessageService(conversationId: string) {
    const chatMessages = await this.chatMsgRepository.findChatMsgByConversationId(conversationId);
    return ChatMessageMapper.mapChatMessagesDTO(chatMessages);
  }
}


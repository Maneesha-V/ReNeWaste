import { IChatMessageDocument } from "../../../models/chat/interfaces/chatMessageInterface";

export interface IChatMsgRepository {
  findChatMsgByConversationId(
    conversationId: string,
  ): Promise<IChatMessageDocument[]>;
}

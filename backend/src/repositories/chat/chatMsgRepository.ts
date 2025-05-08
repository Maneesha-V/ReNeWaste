import { ChatMessageModel } from "../../models/chat/chatMessageModel";
import { IChatMessageDocument } from "../../models/chat/interfaces/chatMessageInterface";
import { IChatMsgRepository } from "./interface/IChatMsgRepository";

class ChatMsgRepository implements IChatMsgRepository {
  async findChatMsgByConversationId(conversationId: string): Promise<IChatMessageDocument[]> {
    return await ChatMessageModel.find({ conversationId }).sort({
      createdAt: 1,
    });
  }
}

export default new ChatMsgRepository();

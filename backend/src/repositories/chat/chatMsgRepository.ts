import { ChatMessageModel } from "../../models/chat/chatMessageModel";
import { IChatMessageDocument } from "../../models/chat/interfaces/chatMessageInterface";
import { IChatMsgRepository } from "./interface/IChatMsgRepository";
import { injectable } from "inversify";
import BaseRepository from "../baseRepository/baseRepository";
import mongoose, { Types } from "mongoose";

@injectable()
export class ChatMsgRepository
  extends BaseRepository<IChatMessageDocument>
  implements IChatMsgRepository
{
  constructor() {
    super(ChatMessageModel);
  }
  async findChatMsgByConversationId(
    conversationId: string,
  ): Promise<IChatMessageDocument[]> {
    return await this.model.find({ conversationId }).sort({
      createdAt: 1,
    });
  }
}

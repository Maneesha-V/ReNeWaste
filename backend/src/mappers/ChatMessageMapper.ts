import { ChatMessageDTO } from "../dtos/chatMessage/chatMessageDTO";
import { IChatMessageDocument } from "../models/chat/interfaces/chatMessageInterface";

export class ChatMessageMapper {
  static mapChatMessageDTO(doc: IChatMessageDocument): ChatMessageDTO {
    return {
      _id: doc._id.toString(),
      senderId: doc.receiverId.toString() ?? "",
      senderRole: doc.senderRole,
      receiverId: doc.receiverId.toString() ?? "",
      receiverRole: doc.receiverRole,
      text: doc.text ?? "",
      conversationId: doc.conversationId ?? "",
      createdAt: doc.createdAt,
    };
  }
  static mapChatMessagesDTO(docs: IChatMessageDocument[]): ChatMessageDTO[] {
    return docs.map(doc => this.mapChatMessageDTO(doc))
  }
}

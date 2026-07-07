"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageMapper = void 0;
class ChatMessageMapper {
    static mapChatMessageDTO(doc) {
        return {
            _id: doc._id.toString(),
            senderId: doc.receiverId.toString() ?? "",
            senderRole: doc.senderRole,
            receiverId: doc.receiverId.toString() ?? "",
            receiverRole: doc.receiverRole,
            text: doc.text ?? "",
            conversationId: doc.conversationId.toString() ?? "",
            createdAt: doc.createdAt,
        };
    }
    static mapChatMessagesDTO(docs) {
        return docs.map((doc) => this.mapChatMessageDTO(doc));
    }
}
exports.ChatMessageMapper = ChatMessageMapper;

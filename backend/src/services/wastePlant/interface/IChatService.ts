import { ParticipantRole } from "../../../models/chat/interfaces/conversationInterface";

export interface IChatService {
    getOrCreateConversationId( 
        senderId: string,
        senderRole: ParticipantRole,
        receiverId: string,
        receiverRole: ParticipantRole
    ): Promise<string>;
    getChatMessageService(conversationId: string): Promise<any>;
}
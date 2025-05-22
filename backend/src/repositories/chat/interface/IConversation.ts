import { IConversationDocument, ParticipantRole } from "../../../models/chat/interfaces/conversationInterface";

export interface IConversationRepository {
    findConversationByParticipants(
        senderId: string,
        receiverId: string
      ): Promise<IConversationDocument | null>;
    
      createConversation(
        senderId: string,
        senderRole: ParticipantRole,
        receiverId: string,
        receiverRole: ParticipantRole
      ): Promise<IConversationDocument>;
}
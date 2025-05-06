import { Types } from "mongoose";
import { ConversationModel } from "../../models/chat/conversationModel";
import { IConversationRepository } from "./interface/IConversation";
import { ParticipantRole } from "../../models/chat/interfaces/conversationInterface";

class ConversationRepository implements IConversationRepository {
  async findConversationByParticipants(senderId: string, receiverId: string) {
    return await ConversationModel.findOne({
      "participants.participantId": {
        $all: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)],
      },
    });
  }

  async createConversation(
    senderId: string,
    senderRole: ParticipantRole,
    receiverId: string,
    receiverRole: ParticipantRole
  ) {
    const conversation = await ConversationModel.create({
      participants: [
        { participantId: new Types.ObjectId(senderId), role: senderRole },
        { participantId: new Types.ObjectId(receiverId), role: receiverRole },
      ],
    });

    console.log("Created Conversation:", conversation);
    return conversation;
  }
}

export default new ConversationRepository();

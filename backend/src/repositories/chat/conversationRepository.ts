import { Types } from "mongoose";
import { ConversationModel } from "../../models/chat/conversationModel";
import { IConversationRepository } from "./interface/IConversation";
import {
  IConversationDocument,
  ParticipantRole,
} from "../../models/chat/interfaces/conversationInterface";
import { injectable } from "inversify";
import BaseRepository from "../baseRepository/baseRepository";

@injectable()
export class ConversationRepository
  extends BaseRepository<IConversationDocument>
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel);
  }
  async findConversationByParticipants(senderId: string, receiverId: string) {
    return await this.model.findOne({
      "participants.participantId": {
        $all: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)],
      },
    });
  }

  async createConversation(
    senderId: string,
    senderRole: ParticipantRole,
    receiverId: string,
    receiverRole: ParticipantRole,
  ) {
    const conversation = await this.model.create({
      participants: [
        { participantId: new Types.ObjectId(senderId), role: senderRole },
        { participantId: new Types.ObjectId(receiverId), role: receiverRole },
      ],
    });

    console.log("Created Conversation:", conversation);
    return conversation;
  }
}

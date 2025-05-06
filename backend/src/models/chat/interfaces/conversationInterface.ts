import { Document, Types } from "mongoose";

export type ParticipantRole = "driver" | "user" | "wasteplant" | "superadmin";

export interface IParticipant {
  participantId: Types.ObjectId;
  role: ParticipantRole;
}

export interface IConversation extends Document {
  participants: [IParticipant, IParticipant]; 
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationDocument extends IConversation {
  _id: Types.ObjectId;
}

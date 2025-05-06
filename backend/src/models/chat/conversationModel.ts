import mongoose, { Schema } from "mongoose";

const participantSchema = new Schema(
  {
    participantId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "participants.role",
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "driver", "wasteplant", "superadmin"], 
    },
  },
  { _id: false } // prevent _id from being added to each participant object
);

const conversationSchema = new Schema(
  {
    participants: {
      type: [participantSchema],
      validate: [arrayLimit, "{PATH} must contain exactly 2 participants."],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: any[]) {
  return val.length === 2;
}

export const ConversationModel = mongoose.model("Conversation", conversationSchema);

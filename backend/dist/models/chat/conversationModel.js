"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const participantSchema = new mongoose_1.Schema({
    participantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: "participants.role",
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "driver", "wasteplant", "superadmin"],
    },
}, { _id: false });
const conversationSchema = new mongoose_1.Schema({
    participants: {
        type: [participantSchema],
        validate: [arrayLimit, "{PATH} must contain exactly 2 participants."],
    },
}, {
    timestamps: true,
});
function arrayLimit(val) {
    return val.length === 2;
}
exports.ConversationModel = (0, mongoose_1.model)("Conversation", conversationSchema);

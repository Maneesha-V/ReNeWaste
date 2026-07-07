"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageModel = void 0;
const mongoose_1 = require("mongoose");
const chatMessageSchema_1 = require("./chatMessageSchema");
exports.ChatMessageModel = (0, mongoose_1.model)("ChatMessage", chatMessageSchema_1.chatMessageSchema);

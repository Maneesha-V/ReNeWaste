"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ChatMessageMapper_1 = require("../../mappers/ChatMessageMapper");
let ChatService = class ChatService {
    chatMsgRepository;
    convestnRepository;
    constructor(chatMsgRepository, convestnRepository) {
        this.chatMsgRepository = chatMsgRepository;
        this.convestnRepository = convestnRepository;
    }
    async getOrCreateConversationId(senderId, senderRole, receiverId, receiverRole) {
        let conversation = await this.convestnRepository.findConversationByParticipants(senderId, receiverId);
        if (!conversation) {
            conversation = await this.convestnRepository.createConversation(senderId, senderRole, receiverId, receiverRole);
        }
        return conversation._id.toString();
    }
    async getChatMessageService(conversationId) {
        const chatMessages = await this.chatMsgRepository.findChatMsgByConversationId(conversationId);
        return ChatMessageMapper_1.ChatMessageMapper.mapChatMessagesDTO(chatMessages);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.ChatMsgRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.ConversationRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ChatService);

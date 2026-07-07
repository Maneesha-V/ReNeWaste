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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMsgRepository = void 0;
const chatMessageModel_1 = require("../../models/chat/chatMessageModel");
const inversify_1 = require("inversify");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
let ChatMsgRepository = class ChatMsgRepository extends baseRepository_1.default {
    constructor() {
        super(chatMessageModel_1.ChatMessageModel);
    }
    async findChatMsgByConversationId(conversationId) {
        return await this.model.find({ conversationId }).sort({
            createdAt: 1,
        });
    }
};
exports.ChatMsgRepository = ChatMsgRepository;
exports.ChatMsgRepository = ChatMsgRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatMsgRepository);

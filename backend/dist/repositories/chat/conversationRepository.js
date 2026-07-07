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
exports.ConversationRepository = void 0;
const mongoose_1 = require("mongoose");
const conversationModel_1 = require("../../models/chat/conversationModel");
const inversify_1 = require("inversify");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
let ConversationRepository = class ConversationRepository extends baseRepository_1.default {
    constructor() {
        super(conversationModel_1.ConversationModel);
    }
    async findConversationByParticipants(senderId, receiverId) {
        return await this.model.findOne({
            "participants.participantId": {
                $all: [new mongoose_1.Types.ObjectId(senderId), new mongoose_1.Types.ObjectId(receiverId)],
            },
        });
    }
    async createConversation(senderId, senderRole, receiverId, receiverRole) {
        const conversation = await this.model.create({
            participants: [
                { participantId: new mongoose_1.Types.ObjectId(senderId), role: senderRole },
                { participantId: new mongoose_1.Types.ObjectId(receiverId), role: receiverRole },
            ],
        });
        console.log("Created Conversation:", conversation);
        return conversation;
    }
};
exports.ConversationRepository = ConversationRepository;
exports.ConversationRepository = ConversationRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ConversationRepository);

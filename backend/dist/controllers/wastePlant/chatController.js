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
exports.ChatController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let ChatController = class ChatController {
    _chatService;
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    async getConversationId(req, res, next) {
        try {
            console.log(req.body);
            const { senderId, receiverId, senderRole, receiverRole } = req.body;
            if (!senderId || !receiverId || !senderRole || !receiverRole) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const conversationId = await this._chatService.getOrCreateConversationId(senderId, senderRole, receiverId, receiverRole);
            console.log("conversationId--", conversationId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                conversationId,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async getChatMessages(req, res, next) {
        try {
            console.log(req.body);
            const { conversationId } = req.body;
            if (!conversationId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const messages = await this._chatService.getChatMessageService(conversationId);
            console.log("messages", messages);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ messages });
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            next(error);
        }
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantChatService)),
    __metadata("design:paramtypes", [Object])
], ChatController);

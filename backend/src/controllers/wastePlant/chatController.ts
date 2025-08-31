import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IChatController } from "./interface/IChatController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IChatService } from "../../services/wastePlant/interface/IChatService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject(TYPES.PlantChatService)
    private chatService: IChatService
  ) {}
  async getConversationId(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body);

      const { senderId, receiverId, senderRole, receiverRole } = req.body;
      if (!senderId || !receiverId || !senderRole || !receiverRole) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS
        );
      }

      const conversationId = await this.chatService.getOrCreateConversationId(
        senderId,
        senderRole,
        receiverId,
        receiverRole
      );
      console.log("conversationId", conversationId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        conversationId,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async getChatMessages(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body);

      const { conversationId } = req.body;

      if (!conversationId) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.ID_REQUIRED
        );
      }
      const messages = await this.chatService.getChatMessageService(
        conversationId
      );
      console.log("messages", messages);

      res.status(STATUS_CODES.SUCCESS).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      next(error);
    }
  }
}

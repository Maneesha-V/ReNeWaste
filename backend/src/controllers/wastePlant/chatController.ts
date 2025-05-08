import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IChatController } from "./interface/IChatController";
import ChatService from "../../services/wastePlant/chatService";

class ChatController implements IChatController {
  async getConversationId(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log(req.body);

      const { senderId, receiverId, senderRole, receiverRole } = req.body;
      if (!senderId || !receiverId || !senderRole || !receiverRole) {
        res.status(400).json({
          success: false,
          message:
            "Sender ID, Receiver ID, Sender Role, and Receiver Role are required.",
        });
        return;
      }

      const conversationId = await ChatService.getOrCreateConversationId(
        senderId,
        senderRole,
        receiverId,
        receiverRole
      );
      console.log("conversationId", conversationId);

      res.status(200).json({
        success: true,
        conversationId,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({
        success: false,
        message: "Failed to get conversation ID",
        error: error.message,
      });
    }
  }
  async getChatMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log(req.body);
      
      const { conversationId } = req.body;
  
      if (!conversationId) {
        res.status(400).json({ error: "conversationId is required" });
        return;
      }
      const messages = await ChatService.getChatMessageService(conversationId);
      console.log("messages",messages);
      
      res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }
}
export default new ChatController();

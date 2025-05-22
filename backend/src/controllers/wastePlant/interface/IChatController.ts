import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IChatController {
    getConversationId  (req: AuthRequest, res: Response): Promise<void>;
    getChatMessages(req: AuthRequest, res: Response): Promise<void>;
}
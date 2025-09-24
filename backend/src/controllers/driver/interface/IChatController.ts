import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IChatController {
  getConversationId(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getChatMessages(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

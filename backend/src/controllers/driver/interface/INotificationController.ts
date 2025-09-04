import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface INotificationController {
    fetchNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    markReadNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void>
}
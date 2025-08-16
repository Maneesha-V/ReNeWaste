import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface INotificationController {
    fetchNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    markReadNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
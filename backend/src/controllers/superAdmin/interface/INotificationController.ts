import { AuthRequest } from "../../../types/common/middTypes";
import { Response } from "express";

export interface INotificationController {
    fetchNotifications(req: AuthRequest, res: Response): Promise<void>;
    markReadNotification(req: AuthRequest, res: Response): Promise<void>;
    // remindRenewNotification (req: AuthRequest, res: Response): Promise<void>;
    // remindRechargeNotification (req: AuthRequest, res: Response): Promise<void>;
}
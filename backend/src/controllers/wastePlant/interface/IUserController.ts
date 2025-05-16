import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IUserController {
    fetchUsers(req: AuthRequest, res: Response): Promise<void>;
    userBlockStatus(req: AuthRequest, res: Response): Promise<void>;
}
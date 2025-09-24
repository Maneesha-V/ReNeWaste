import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IUserController {
    fetchUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    userBlockStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
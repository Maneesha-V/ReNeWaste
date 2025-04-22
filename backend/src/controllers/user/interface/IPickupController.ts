import { Request, Response } from "express";
import { ProfileUserRequest } from "../../../types/user/authTypes";

export interface IPickupController {
    getPickupPlans(req: ProfileUserRequest, res: Response): Promise<void>
}
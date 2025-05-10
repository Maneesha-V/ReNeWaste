import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IProfileController {
  getProfile(req: AuthRequest, res: Response): Promise<void>;
  getEditProfile(req: AuthRequest, res: Response): Promise<void>;
  updateUserProfileHandler(req: AuthRequest, res: Response): Promise<void>;
}

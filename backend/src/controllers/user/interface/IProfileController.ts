import { Request, Response } from "express";
import { CustomRequest } from "../../../types/user/profileTypes";

export interface IProfileController {
  getProfile(req: CustomRequest, res: Response): Promise<void>;
  getEditProfile(req: CustomRequest, res: Response): Promise<void>;
  updateUserProfileHandler(req: CustomRequest, res: Response): Promise<void>;
}

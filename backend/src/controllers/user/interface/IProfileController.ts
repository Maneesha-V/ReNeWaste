import { Request, Response } from "express";
import { ProfileRequest } from "../../../types/user/profileTypes";

export interface IProfileController {
  getProfile(req: ProfileRequest, res: Response): Promise<void>;
  getEditProfile(req: ProfileRequest, res: Response): Promise<void>;
  updateUserProfileHandler(req: ProfileRequest, res: Response): Promise<void>;
}

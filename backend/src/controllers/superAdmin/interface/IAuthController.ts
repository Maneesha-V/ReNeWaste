import { Request, Response } from "express";

export interface IAuthController {
  superAdminLogin(req: Request, res: Response): Promise<void>;
  superAdminSignup(req: Request, res: Response): Promise<void>;
  superAdminLogout(req: Request, res: Response): Promise<void>;
}

import { Request, Response } from "express";

export interface IAuthController {
  superAdminLogin(req: Request, res: Response): Promise<void>;
}

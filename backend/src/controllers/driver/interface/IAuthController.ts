import { Request, Response } from "express";

export interface IAuthController {
  driverLogin(req: Request, res: Response): Promise<void>;
}
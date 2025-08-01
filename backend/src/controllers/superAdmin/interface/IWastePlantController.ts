import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IWastePlantController {
    addWastePlant(req: Request, res: Response): Promise<void>;
    viewLicenseDocument(req: Request, res: Response): Promise<void>;
    fetchWastePlants(req: AuthRequest, res: Response): Promise<void>;
    getWastePlantById(req: Request, res: Response): Promise<void>;
    updateWastePlant (req: Request,res: Response): Promise<void>;
    deleteWastePlantById (req: Request,res: Response): Promise<void>;
    sendSubscribeNotification(req: AuthRequest, res: Response): Promise<void>;
  }
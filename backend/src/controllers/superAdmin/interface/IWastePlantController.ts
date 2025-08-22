import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IWastePlantController {
    getAddWastePlant(req: Request, res: Response, next: NextFunction): Promise<void>;
    addWastePlant(req: Request, res: Response, next: NextFunction): Promise<void>;
    viewLicenseDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchWastePlants(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getWastePlantById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateWastePlant (req: Request,res: Response, next: NextFunction): Promise<void>;
    deleteWastePlantById (req: Request,res: Response, next: NextFunction): Promise<void>;
    // sendSubscribeNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    plantBlockStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void>
  }
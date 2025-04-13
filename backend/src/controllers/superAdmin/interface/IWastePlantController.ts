import { Request, Response } from "express";

export interface IWastePlantController {
    addWastePlant(req: Request, res: Response): Promise<void>;
    fetchWastePlants(req: Request, res: Response): Promise<void>;
    getWastePlantById(req: Request, res: Response): Promise<void>;
    updateWastePlant (req: Request,res: Response): Promise<void>;
    deleteWastePlantById (req: Request,res: Response): Promise<void>;
  }
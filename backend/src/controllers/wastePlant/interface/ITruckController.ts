import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface ITruckController {
    addTruck (req: AuthRequest, res: Response): Promise<void>;
    fetchTrucks (req: Request,res: Response): Promise<void>;
    fetchAvailableTrucks (req: Request,res: Response): Promise<void>;
    getTruckById (req: Request,res: Response): Promise<void>;
    updateTruck (req: Request,res: Response): Promise<void>;
    deleteTruckById (req: Request,res: Response): Promise<void>;
}
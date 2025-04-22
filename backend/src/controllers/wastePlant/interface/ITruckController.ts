import { Request, Response } from "express";
import { ProfilePlantRequest } from "../../../types/wastePlant/authTypes";

export interface ITruckController {
    addTruck (req: ProfilePlantRequest, res: Response): Promise<void>;
    fetchTrucks (req: Request,res: Response): Promise<void>;
    fetchAvailableTrucks (req: Request,res: Response): Promise<void>;
    getTruckById (req: Request,res: Response): Promise<void>;
    updateTruck (req: Request,res: Response): Promise<void>;
    deleteTruckById (req: Request,res: Response): Promise<void>;
}
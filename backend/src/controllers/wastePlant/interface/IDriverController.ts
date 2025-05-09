import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IDriverController {
    addDriver(req: AuthRequest, res: Response): Promise<void>;
    fetchDrivers (req: AuthRequest,res: Response): Promise<void>;
    getDriverById (req: Request,res: Response): Promise<void>;
    updateDriver (req: Request,res: Response): Promise<void>;
    deleteDriverById (req: Request,res: Response): Promise<void>;
}
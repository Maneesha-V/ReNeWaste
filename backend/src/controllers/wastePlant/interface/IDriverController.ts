import { Request, Response } from "express";

export interface IDriverController {
    addDriver(req: Request, res: Response): Promise<void>;
    fetchDrivers (req: Request,res: Response): Promise<void>;
    getDriverById (req: Request,res: Response): Promise<void>;
    updateDriver (req: Request,res: Response): Promise<void>;
}
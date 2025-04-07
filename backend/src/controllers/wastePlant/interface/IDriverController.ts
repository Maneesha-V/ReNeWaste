import { Request, Response } from "express";

export interface IDriverController {
    addDriver(req: Request, res: Response): Promise<void>;
    fetchDrivers (req: Request,res: Response): Promise<void>;
}
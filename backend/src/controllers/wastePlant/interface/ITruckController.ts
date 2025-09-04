import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface ITruckController {
    addTruck (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    fetchTrucks (req: AuthRequest,res: Response, next: NextFunction): Promise<void>;
    fetchAvailableTrucks (req: AuthRequest,res: Response, next: NextFunction): Promise<void>;
    getTruckById (req: Request,res: Response, next: NextFunction): Promise<void>;
    updateTruck (req: Request,res: Response, next: NextFunction): Promise<void>;
    deleteTruckById (req: AuthRequest,res: Response, next: NextFunction): Promise<void>;
    getAvailableTruckReqsts (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTrucksForDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    assignTruckToDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
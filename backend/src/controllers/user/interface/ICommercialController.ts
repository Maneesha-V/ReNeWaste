import { Request, Response } from "express";
import { CommercialRequest } from "../../../types/user/commercialTypes";

export interface ICommercialController {
    getCommercial(req: CommercialRequest, res: Response): Promise<void>;
    checkServiceAvailable(req: CommercialRequest, res: Response): Promise<void>
    updateCommercialPickup(req: CommercialRequest, res: Response): Promise<void>
}

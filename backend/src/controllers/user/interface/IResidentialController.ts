import { Request, Response } from "express";
import { ResidentialRequest } from "../../../types/user/residentialTypes";

export interface IResidentialController {
    getResidential(req: ResidentialRequest, res: Response): Promise<void>;
    updateResidentialPickup(req: ResidentialRequest, res: Response): Promise<void>;
}

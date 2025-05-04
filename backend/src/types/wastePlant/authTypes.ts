import { IWastePlantDocument } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { Request } from 'express';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  wastePlant: IWastePlantDocument;
  token: string;
}

  export interface PickupFilterParams {
    status?: string;
    wasteType?: string;
    plantId: string;
  }
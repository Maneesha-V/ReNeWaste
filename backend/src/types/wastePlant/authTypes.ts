import { IWastePlantDocument } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { Request } from 'express';

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  wastePlant: IWastePlantDocument;
  token: string;
}

  // export type PickupFilterParams = {
  //   status?: string;
  //   wasteType?: string;
  //   plantId: string;
  // }
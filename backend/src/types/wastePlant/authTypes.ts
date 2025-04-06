import { IWastePlantDocument } from "../../models/wastePlant/interfaces/wastePlantInterface";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  wastePlant: IWastePlantDocument;
  token: string;
}
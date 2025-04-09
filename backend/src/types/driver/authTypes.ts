import { Request } from "express";
import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  driver: IDriverDocument;
  token: string;
}
export interface ProfileDriverRequest extends Request {
    driver?: { driverId: string };
  }
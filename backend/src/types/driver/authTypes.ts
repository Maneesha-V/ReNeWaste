import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";


export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  driver: IDriverDocument;
  token: string;
}

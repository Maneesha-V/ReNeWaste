import { model } from "mongoose";
import { driverSchema } from "./driverSchema";
import { IDriverDocument } from "./interfaces/driverInterface";

export const DriverModel =  model<IDriverDocument>('Driver', driverSchema);
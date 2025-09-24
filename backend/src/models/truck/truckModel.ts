import { model } from "mongoose";
import { ITruckDocument } from "./interfaces/truckInterface";
import { truckSchema } from "./truckSchema";

export const TruckModel = model<ITruckDocument>("Truck", truckSchema);

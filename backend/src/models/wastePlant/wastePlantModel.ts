import { model } from "mongoose";
import { wastePlantSchema } from "../wastePlant/wastePlantSchema"
import { IWastePlantDocument } from "./interfaces/wastePlantInterface";

export const WastePlantModel =  model<IWastePlantDocument>('WastePlant', wastePlantSchema);
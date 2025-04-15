import { model } from "mongoose";
import { IPickupRequestDocument } from "./interfaces/pickupInterface";
import { pickupRequestSchema } from "./pickupSchema";

export const PickupModel =  model<IPickupRequestDocument>('PickupRequests', pickupRequestSchema);
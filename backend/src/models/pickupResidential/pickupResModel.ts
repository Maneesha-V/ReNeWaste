import { model } from "mongoose";
import { IPickupRequestResidentialDocument } from "./interfaces/pickupResInterface";
import { pickupRequestResidentialSchema } from "./pickupResSchema";

export const PickupResidentialModel =  model<IPickupRequestResidentialDocument>('PickupResidential', pickupRequestResidentialSchema);
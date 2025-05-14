import { model } from "mongoose";
import { IDropSpotDocument } from "./interfaces/dropSpotInterface";
import { DropSpotSchema } from "./dropSpotSchema";

export const DropSpotModel =  model<IDropSpotDocument>('DropSpot', DropSpotSchema);
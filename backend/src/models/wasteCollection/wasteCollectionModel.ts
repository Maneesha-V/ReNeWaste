import { model } from "mongoose";
import { IWasteCollectionDocument } from "./interfaces/wasteCollectionInterface";
import { wasteCollectionSchema } from "./wasteCollectionSchema";

export const WasteCollectionModel = model<IWasteCollectionDocument>(
  "WasteCollection",
  wasteCollectionSchema,
);

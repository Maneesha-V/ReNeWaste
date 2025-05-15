import mongoose from "mongoose";
import { IDropSpot } from "../../../models/dropSpots/interfaces/dropSpotInterface";

export interface IDropSpotRepository {
  createDropSpot(payload: IDropSpot): Promise<IDropSpot>;
  getDropSpotsByWastePlantId(wasteplantId: string): Promise<IDropSpot[]>;
  getDropSpotsByLocationAndWasteplant(params: {
    location: string;
    district: string;
    state: string;
    wasteplantId: mongoose.Types.ObjectId;
  }): Promise<IDropSpot[]>;
  findDropSpotById(dropSpotId: string): Promise<IDropSpot | null>;
  deleteDropSpotById(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null>;
  updateDropSpot(
    dropSpotId: string,
    updateData: any
  ): Promise<IDropSpot | null>;
}

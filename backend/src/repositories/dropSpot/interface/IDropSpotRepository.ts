import mongoose from "mongoose";
import { IDropSpot, IDropSpotDocument } from "../../../models/dropSpots/interfaces/dropSpotInterface";
import { PaginatedDropSpotsResult } from "../../../types/wastePlant/dropspotTypes";

export interface IDropSpotRepository {
  createDropSpot(payload: IDropSpot): Promise<IDropSpot>;
  getDropSpotsByWastePlantId(wasteplantId: string , page: number, limit: number, search: string): Promise<PaginatedDropSpotsResult>;
  getDropSpotsByLocationAndWasteplant(params: {
    location: string;
    district: string;
    state: string;
    wasteplantId: mongoose.Types.ObjectId;
  }): Promise<IDropSpotDocument[]>;
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

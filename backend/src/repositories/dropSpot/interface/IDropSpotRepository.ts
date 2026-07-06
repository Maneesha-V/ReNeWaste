import mongoose from "mongoose";
import {
  IDropSpot,
  IDropSpotDocument,
  PaginatedDropSpotsRepoRes,
  UpdateDataDropSpotReq,
} from "../../../models/dropSpots/interfaces/dropSpotInterface";


export interface IDropSpotRepository {
  createDropSpot(payload: IDropSpot): Promise<IDropSpot>;
  getDropSpotsByWastePlantId(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedDropSpotsRepoRes>;
  getDropSpotsByLocationAndWasteplant(params: {
    location: string;
    district: string;
    state: string;
    wasteplantId: mongoose.Types.ObjectId;
  }): Promise<IDropSpotDocument[]>;
  findDropSpotById(
    dropSpotId: string,
    wasteplantId: string,
  ): Promise<IDropSpotDocument | null>;
  deleteDropSpotById(
    dropSpotId: string,
    wasteplantId: string,
  ): Promise<IDropSpotDocument | null>;
  updateDropSpot(
    dropSpotId: string,
    updateData: UpdateDataDropSpotReq,
  ): Promise<IDropSpotDocument | null>;
}

import { IDropSpot } from "../../../models/dropSpots/interfaces/dropSpotInterface";
import { PaginatedDropSpotsResult } from "../../../types/wastePlant/dropspotTypes";

export interface IDropSpotService {
  createDropSpotService(payload: IDropSpot): Promise<IDropSpot>;
  getAllDropSpots(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedDropSpotsResult>
  getDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null>;
  deleteDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<IDropSpot | null>;
  updateDropSpotService(
    wasteplantId: string,
    dropSpotId: string,
    updateData: any
  ): Promise<IDropSpot | null>;
}

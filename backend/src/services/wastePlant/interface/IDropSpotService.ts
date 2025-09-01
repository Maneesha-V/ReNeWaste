import { DropSpotDTO, PaginatedDropSpotsResult, UpdateDataDropSpot } from "../../../dtos/dropspots/dropSpotDTO";
import { IDropSpot } from "../../../models/dropSpots/interfaces/dropSpotInterface";

export interface IDropSpotService {
  createDropSpotService(payload: IDropSpot): Promise<boolean>;
  getAllDropSpots(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedDropSpotsResult>
  getDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<DropSpotDTO>;
  deleteDropSpotByIdService(
    dropSpotId: string,
    wasteplantId: string
  ): Promise<DropSpotDTO>;
  updateDropSpotService(
    wasteplantId: string,
    dropSpotId: string,
    updateData: UpdateDataDropSpot
  ): Promise<DropSpotDTO>;
}

import { IDropSpot } from "../../../models/dropSpots/interfaces/dropSpotInterface";

export interface IDropSpotService {
  createDropSpotService(payload: IDropSpot): Promise<IDropSpot>;
  getAllDropSpots(wasteplantId: string): Promise<IDropSpot[]>;
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

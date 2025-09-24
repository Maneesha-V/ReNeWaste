import { DropSpotDTO } from "../../../dtos/dropspots/dropSpotDTO";

export interface IDropSpotService {
  getAllNearDropSpots(userId: string): Promise<DropSpotDTO[]>;
}

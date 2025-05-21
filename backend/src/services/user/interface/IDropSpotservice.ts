import { IDropSpot } from "../../../models/dropSpots/interfaces/dropSpotInterface";

export interface IDropSpotService {
    getAllNearDropSpots(userId: string): Promise<IDropSpot[]>
}
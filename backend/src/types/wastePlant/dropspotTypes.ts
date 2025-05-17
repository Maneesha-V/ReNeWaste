import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";

export interface PaginatedDropSpotsResult {
  dropspots: IDropSpot[];
  total: number;
}
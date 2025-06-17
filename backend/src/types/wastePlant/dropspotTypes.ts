import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";

export type PaginatedDropSpotsResult = {
  dropspots: IDropSpot[];
  total: number;
}
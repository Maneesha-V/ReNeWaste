import { IDropSpotDocument } from "../../models/dropSpots/interfaces/dropSpotInterface";
import { BaseDTO } from "../base/BaseDTO";

export interface DropSpotDTO extends BaseDTO {
  dropSpotName: string;
  addressLine: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
export type PaginatedDropSpotsResult = {
  dropspots: DropSpotDTO[];
  total: number;
}
export type PaginatedDropSpotsRepoRes = {
  dropspots: IDropSpotDocument[];
  total: number;
}
export type UpdateDataDropSpot = {
  dropSpotName: string;
  addressLine: string;
  location: string;
  pincode: string;
  district: string;
  state: string;
}
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

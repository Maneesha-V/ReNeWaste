export type UserDropSpot = {
  _id: string;
  dropSpotName: string;
  addressLine: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
export type FetchDropSpotResp = {
  message: string;
  dropspots: UserDropSpot[];
}
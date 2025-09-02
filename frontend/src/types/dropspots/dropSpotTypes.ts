export type DropSpotDTO = {
  _id: string;
  dropSpotName: string;
  addressLine: string;
  location: string;
  pincode: string;
  state: string;
  district: string;
  wasteplantId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};
export type UserDropSpot = {
  _id: string;
  dropSpotName: string;
  addressLine: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};
export type FetchUserDropSpotResp = {
  message: string;
  dropspots: UserDropSpot[];
};
export type DropSpotFormValues = {
  dropSpotName: string;
  addressLine: string;
  location: string;
  pincode: string;
  district: string;
  state: string;
};
export type FetchDropSpotResp = {
  success: boolean;
  message: string;
  dropspots: DropSpotDTO[];
  total: number;
};
export type DelDropSpotResp = {
  dropspot: DropSpotDTO;
  message: string;
}
export type updateDropSpotReq = {
  dropSpotId: string; 
  data: DropSpotFormValues
}
export  type updatedDropSpotResp = {
  message: string;
  updatedDropSpot: DropSpotDTO;
}
import {
  IPickupRequest,
  IPickupRequestDocument,
} from "../../../models/pickupRequests/interfaces/pickupInterface";
import { IUserDocument } from "../../../models/user/interfaces/userInterface";
import { PickupDriverFilterParams } from "../../../types/driver/pickupTypes";

export interface IPickupService {
  getPickupRequestService(
    filters: PickupDriverFilterParams
  ): Promise<IPickupRequest[]>;
  getPickupByIdForDriver(
    pickupReqId: string,
    driverId: string
  ): Promise<IPickupRequest | null>;
  updateAddressLatLngService(
    addressId: string,
    latitude: number,
    longitude: number
  ): Promise<any>;
  updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<IPickupRequestDocument | null>;
  markPickupCompletedService(
    pickupReqId: string
  ): Promise<IPickupRequestDocument | null>;
}

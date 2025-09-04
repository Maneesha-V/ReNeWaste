import { PickupDriverFilterParams } from "../../../dtos/pickupReq/pickupReqDTO";
import {
  IPickupRequest,
  IPickupRequestDocument,
} from "../../../models/pickupRequests/interfaces/pickupInterface";
import { IUserDocument } from "../../../models/user/interfaces/userInterface";
import { EnhancedPickup } from "../../../repositories/pickupReq/interface/IPickupRepository";


export interface IPickupService {
  getPickupRequestService(
    filters: PickupDriverFilterParams
  ): Promise<EnhancedPickup[]>;
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

import { MarkPickupCompletedResp } from "../../../dtos/driver/driverDTO";
import { PickupDriverFilterParams, PickupReqDTO, PickupReqGetDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { AddressDTO } from "../../../dtos/user/userDTO";
import {
  IPickupRequest,
  IPickupRequestDocument,
} from "../../../models/pickupRequests/interfaces/pickupInterface";
import { IUserDocument } from "../../../models/user/interfaces/userInterface";
import { EnhancedPickup } from "../../../repositories/pickupReq/interface/IPickupRepository";


export interface IPickupService {
  getPickupRequestService(
    filters: PickupDriverFilterParams
  ): Promise<PickupReqGetDTO[]>;
  getPickupByIdForDriver(
    pickupReqId: string,
    driverId: string
  ): Promise<PickupReqGetDTO>;
  updateAddressLatLngService(
    addressId: string,
    latitude: number,
    longitude: number
  ): Promise<AddressDTO>;
  updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<PickupReqDTO>;
  markPickupCompletedService(
    pickupReqId: string
  ): Promise<MarkPickupCompletedResp>;
}

import { IPickupRequest, IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { IUserDocument } from "../../models/user/interfaces/userInterface";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import UserRepository from "../../repositories/user/userRepository";
import { PickupDriverFilterParams } from "../../types/driver/pickupTypes";
import { IPickupService } from "./interface/IPickupService";

class PickupService implements IPickupService {
  async getPickupRequestService(
    filters: PickupDriverFilterParams
  ): Promise<IPickupRequest[]> {
    return await PickupRepository.getPickupsByDriverId(filters);
  }
  async getPickupByIdForDriver(pickupReqId: string, driverId: string) {
    const pickup = await PickupRepository.findPickupByIdAndDriver(pickupReqId, driverId);
    return pickup;
  }
  async updateAddressLatLngService(addressId: string, latitude: number, longitude: number): Promise<any> {
    return await UserRepository.updateAddressByIdLatLng(addressId, latitude, longitude);
  }
  async updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<IPickupRequestDocument | null> {
    return await PickupRepository.updateTrackingStatus(pickupReqId, trackingStatus);
  }
}
export default new PickupService();
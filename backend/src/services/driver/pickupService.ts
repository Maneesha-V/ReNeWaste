import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
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
}
export default new PickupService();
import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { PickupDriverFilterParams } from "../../types/driver/pickupTypes";
import { IPickupService } from "./interface/IPIckupService";

class PickupService implements IPickupService {
  async getPickupRequestService(
    filters: PickupDriverFilterParams
  ): Promise<IPickupRequest[]> {
    return await PickupRepository.getPickupsByDriverId(filters);
  }
}
export default new PickupService();
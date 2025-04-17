import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import { IPickupService } from "./interface/IPickupService";

class PickupService implements IPickupService {
     async getPickupRequestService(filters: PickupFilterParams): Promise<IPickupRequest[]> {
        return await PickupRepository.getPickupsByPlantId(filters);
      }
}
export default new PickupService();
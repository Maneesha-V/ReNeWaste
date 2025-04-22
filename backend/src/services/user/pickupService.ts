import UserRepository from "../../repositories/user/userRepository";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { IPickupService } from "./interface/IPIckupService";

class PickupService implements IPickupService {
    
      async getPickupPlanService(userId: string) {
        const pickups = await PickupRepository.getPickupPlansByUserId(userId);
        if (!pickups) throw new Error("No pickup plans found");
        return pickups;
      }
}
export default new PickupService();
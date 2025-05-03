import UserRepository from "../../repositories/user/userRepository";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { IPickupService } from "./interface/IPIckupService";
import { IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";

class PickupService implements IPickupService {
    
      async getPickupPlanService(userId: string) {
        const pickups = await PickupRepository.getPickupPlansByUserId(userId);
        console.log("pickups",pickups);
        
        if (!pickups) throw new Error("No pickup plans found");
        return pickups;
      }
      async cancelPickupPlanService(pickupReqId: string) {
        const pickup = await PickupRepository.getPickupById(pickupReqId);
        if (!pickup) {
          throw new Error("Pickup not found");
        }
        console.log("user-pickup",pickup);
        
        if (pickup.status === "Cancelled") {
          throw new Error("Pickup already canceled");
        }
      
        return await PickupRepository.updatePickupStatus(pickupReqId, "Cancelled");
      }

}
export default new PickupService();
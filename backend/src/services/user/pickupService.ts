import { IPickupService } from "./interface/IPIckupService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
  ){}
  async getPickupPlanService(userId: string) {
    const pickups = await this.pickupRepository.getPickupPlansByUserId(userId);
    console.log("pickups", pickups);

    if (!pickups) throw new Error("No pickup plans found");
    return pickups;
  }
  async cancelPickupPlanService(pickupReqId: string) {
    const pickup = await this.pickupRepository.getPickupById(pickupReqId);
    if (!pickup) {
      throw new Error("Pickup not found");
    }
    console.log("user-pickup", pickup);

    if (pickup.status === "Cancelled") {
      throw new Error("Pickup already canceled");
    }

    return await this.pickupRepository.updatePickupStatus(pickupReqId, "Cancelled");
  }
}


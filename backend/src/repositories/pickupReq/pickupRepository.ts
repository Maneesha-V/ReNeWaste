import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import { PickupModel } from "../../models/pickupRequests/pickupModel";
import { IPickupRepository } from "./interface/IPickupRepository";


class PickupRepository implements IPickupRepository {
    async createPickup(pickupData: Partial<IPickupRequest>) {
        const newPickup = new PickupModel(pickupData);
        return await newPickup.save();
      }
}
export default new PickupRepository();
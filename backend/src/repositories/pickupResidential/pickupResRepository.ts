import { IPickupRequestResidential } from "../../models/pickupResidential/interfaces/pickupResInterface";
import { PickupResidentialModel } from "../../models/pickupResidential/pickupResModel";
import { IPickupResidentialRepository } from "./interface/IPickupResRepository";

class PickupResidentialRepository implements IPickupResidentialRepository {
    async createPickup(pickupData: Partial<IPickupRequestResidential>) {
        const newPickup = new PickupResidentialModel(pickupData);
        return await newPickup.save();
      }
}
export default new PickupResidentialRepository();
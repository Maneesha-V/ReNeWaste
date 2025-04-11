import { IPickupRequestResidential, IPickupRequestResidentialDocument } from "../../../models/pickupResidential/interfaces/pickupResInterface";

export interface IPickupResidentialRepository {
    createPickup(pickupData: Partial<IPickupRequestResidential>): Promise<IPickupRequestResidentialDocument>;

}
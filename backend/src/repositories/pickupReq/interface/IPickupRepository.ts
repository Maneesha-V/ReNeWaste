import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";

export interface IPickupRepository {
    createPickup(pickupData: Partial<IPickupRequest>): Promise<IPickupRequestDocument>;
}
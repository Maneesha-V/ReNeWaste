import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupFilterParams } from "../../../types/wastePlant/authTypes";

export interface IPickupRepository {
    createPickup(pickupData: Partial<IPickupRequest>): Promise<IPickupRequestDocument>;
    getPickupsByPlantId(filters: PickupFilterParams): Promise<IPickupRequest[]>;
}
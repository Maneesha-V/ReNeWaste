import { IPickupRequest } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupFilterParams } from "../../../types/wastePlant/authTypes";

export interface IPickupService {
   getPickupRequestService(filters: PickupFilterParams): Promise<IPickupRequest[]>;
}
import { IPickupRequest } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupDriverFilterParams } from "../../../types/driver/pickupTypes";

export interface IPickupService {
   getPickupRequestService(filters: PickupDriverFilterParams): Promise<IPickupRequest[]>;
}
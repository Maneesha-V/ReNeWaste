import { IDriverDocument } from "../../../models/driver/interfaces/driverInterface";
import { IPickupRequest } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupFilterParams } from "../../../types/wastePlant/authTypes";
import { ApprovePickupDTO, ReschedulePickupDTO } from "../../../types/wastePlant/pickupTypes";

export interface IPickupService {
   getPickupRequestService(filters: PickupFilterParams): Promise<IPickupRequest[]>;
   approvePickupService(data: ApprovePickupDTO): Promise<IPickupRequest>;
   cancelPickupRequest(pickupReqId: string, status: string): Promise<IPickupRequest>;
   reschedulePickup(wasteplantId: string, pickupReqId: string, data: ReschedulePickupDTO): Promise<IPickupRequest>;
   getAvailableDriverService(location: string, plantId: string): Promise<IDriverDocument[]>;
}
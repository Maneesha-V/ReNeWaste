import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";

export interface IPickupService {
    getPickupPlanService(userId: string): Promise<IPickupRequestDocument[]>;
    cancelPickupPlanService(pickupReqId: string): Promise<IPickupRequestDocument | null>;
}
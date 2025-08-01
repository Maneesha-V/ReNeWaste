import { PickupPlansDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { cancelPickupReasonData } from "../../../types/user/pickupTypes";

export interface IPickupService {
    getPickupPlanService(userId: string): Promise<PickupPlansDTO[]>;
    cancelPickupPlanService(pickupReqId: string): Promise<IPickupRequestDocument | null>;
    cancelPickupReasonRequest(data: cancelPickupReasonData): Promise<IPickupRequestDocument | null>;
}
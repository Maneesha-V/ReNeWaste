import { PickupPlansDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { cancelPickupReasonData } from "../../../types/user/pickupTypes";

export interface IPickupService {
    getPickupPlanService(userId: string, page: number, limit: number, search: string, filter: string): Promise<{ pickups: PickupPlansDTO[]; total: number }>;
    cancelPickupPlanService(pickupReqId: string): Promise<IPickupRequestDocument | null>;
    cancelPickupReasonRequest(data: cancelPickupReasonData): Promise<IPickupRequestDocument | null>;
}
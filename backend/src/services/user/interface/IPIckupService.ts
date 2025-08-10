import { PaginationInput } from "../../../dtos/common/commonDTO";
import { PickupPlansDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { cancelPickupReasonData } from "../../../types/user/pickupTypes";

export interface IPickupService {
    getPickupPlanService(userId: string, paginationData: PaginationInput) : Promise<{ pickups: PickupPlansDTO[]; total: number }>;
    cancelPickupPlanService(pickupReqId: string): Promise<IPickupRequestDocument | null>;
    cancelPickupReasonRequest(data: cancelPickupReasonData): Promise<IPickupRequestDocument | null>;
}
import { PaginationInput } from "../../../dtos/common/commonDTO";
import { PaymentDTO, PickupPlansDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { cancelPickupReasonData } from "../../../types/user/pickupTypes";

export interface IPickupService {
    getPickupPlanService(userId: string, paginationData: PaginationInput) : Promise<{ pickups: PickupPlansDTO[]; total: number }>;
    cancelPickupPlanService(pickupReqId: string): Promise<boolean>;
    cancelPickupReasonRequest(data: cancelPickupReasonData): Promise<PaymentDTO>;
}
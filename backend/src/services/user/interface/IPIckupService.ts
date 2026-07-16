import { PaginationInput } from "../../../dtos/common/commonDTO";
import {
  cancelPickupReasonData,
  modCommPickReq,
  PaymentDTO,
  PickupPlansDTO,
} from "../../../dtos/pickupReq/pickupReqDTO";

export interface IPickupService {
  getPickupPlanService(
    userId: string,
    paginationData: PaginationInput,
  ): Promise<{ pickups: PickupPlansDTO[]; total: number }>;
  cancelPickupPlanService(pickupReqId: string): Promise<boolean>;
  cancelPickupReasonRequest(data: cancelPickupReasonData): Promise<PaymentDTO>;
  modifyCommPickupReq(userId: string, data: modCommPickReq): Promise<boolean>;
}

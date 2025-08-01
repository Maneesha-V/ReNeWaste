import { PaginationInput } from "../../../dtos/common/commonDTO";
import { SubscriptionPaymentHisResult } from "../../../dtos/subscription/subscptnPaymentDTO";

export interface IPaymentService {
    fetchPayments(data: PaginationInput): Promise<SubscriptionPaymentHisResult>;
}
import { PaginationInput } from "../../../dtos/common/commonDTO";
import { SubscriptionPaymentDTO, SubscriptionPaymentHisResult, UpdateRefundStatusReq } from "../../../dtos/subscription/subscptnPaymentDTO";

export interface IPaymentService {
    fetchPayments(data: PaginationInput): Promise<SubscriptionPaymentHisResult>;
    updateRefundStatusPayment(data: UpdateRefundStatusReq): Promise<SubscriptionPaymentDTO>;
    refundPayment(data: UpdateRefundStatusReq): Promise<SubscriptionPaymentDTO>;
}
import { RefundStatusUpdateResp, UpdateStatusReq } from "../../../dtos/pickupReq/paymentDTO";
import { PickupReqDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { RetrySubPaymntReq, RetrySubPaymntRes } from "../../../dtos/subscription/subscptnPaymentDTO";
import { FetchPaymentPayload, PaginatedPaymentsResult, RefundDataReq, ReturnSubcptnPaymentResult, ReurnSubcptnCreatePaymt, SubCreatePaymtPayload, VerifyPaymtReq, VerifyPaymtResp } from "../../../dtos/wasteplant/WasteplantDTO";

export interface IPaymentService {
  fetchPayments(data: FetchPaymentPayload): Promise<PaginatedPaymentsResult>
  createPaymentOrder(
    data: SubCreatePaymtPayload
  ): Promise<ReurnSubcptnCreatePaymt>;
  verifyPaymentService(
    data: VerifyPaymtReq
  ): Promise<VerifyPaymtResp>;
  fetchSubscriptionPayments(
    plantId: string
  ): Promise<ReturnSubcptnPaymentResult>;
  retrySubscriptionPayment(data: RetrySubPaymntReq): Promise<RetrySubPaymntRes>;
  updateRefundStatusPayment(data: UpdateStatusReq): Promise<RefundStatusUpdateResp>;
  refundPayment(plantId: string, data: RefundDataReq): Promise<PickupReqDTO>;
}

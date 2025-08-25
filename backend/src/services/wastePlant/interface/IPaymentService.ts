import { RefundStatusUpdateResp, UpdateStatusReq } from "../../../dtos/pickupReq/paymentDTO";
import { RetrySubPaymntReq, RetrySubPaymntRes } from "../../../dtos/subscription/subscptnPaymentDTO";
import { ReturnSubcptnPaymentResult, VerifyPaymtReq, VerifyPaymtResp } from "../../../dtos/wasteplant/WasteplantDTO";
import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { ISubscriptionPaymentDocument } from "../../../models/subsptnPayment/interface/subsptnPaymentInterface";
import {
  FetchPaymentPayload,
  PaginatedPaymentsResult,
  RefundDataReq,
  ReurnSubcptnCreatePaymt,
  SubCreatePaymtPayload
} from "../../../types/wastePlant/paymentTypes";

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
  refundPayment(plantId: string, data: RefundDataReq): Promise<IPickupRequestDocument>;
}

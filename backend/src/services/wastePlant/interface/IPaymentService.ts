import { RefundStatusUpdateResp, UpdateStatusReq } from "../../../dtos/pickupReq/paymentDTO";
import { RetrySubPaymntReq, RetrySubPaymntRes } from "../../../dtos/subscription/subscptnPaymentDTO";
import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { ISubscriptionPaymentDocument } from "../../../models/subsptnPayment/interface/subsptnPaymentInterface";
import {
  FetchPaymentPayload,
  PaginatedPaymentsResult,
  RefundDataReq,
  ReturnSubcptnPaymentResult,
  ReurnSubcptnCreatePaymt,
  SubCreatePaymtPayload,
  VerifyPaymtPayload,
} from "../../../types/wastePlant/paymentTypes";

export interface IPaymentService {
  fetchPayments(data: FetchPaymentPayload): Promise<PaginatedPaymentsResult>
  createPaymentOrder(
    data: SubCreatePaymtPayload
  ): Promise<ReurnSubcptnCreatePaymt>;
  verifyPaymentService(
    data: VerifyPaymtPayload
  ): Promise<ISubscriptionPaymentDocument>;
  fetchSubscriptionPayments(
    plantId: string
  ): Promise<ReturnSubcptnPaymentResult>;
  retrySubscriptionPayment(data: RetrySubPaymntReq): Promise<RetrySubPaymntRes>;
  updateRefundStatusPayment(data: UpdateStatusReq): Promise<RefundStatusUpdateResp>;
  refundPayment(plantId: string, data: RefundDataReq): Promise<IPickupRequestDocument>;
}

import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { ISubscriptionPaymentDocument } from "../../../models/subsptnPayment/interface/subsptnPaymentInterface";
import {
  FetchPaymentPayload,
  PaginatedPaymentsResult,
  RefundDataReq,
  RetryPaymntPayload,
  ReturnRetryPaymntPayload,
  ReturnSubcptnPaymentResult,
  ReurnSubcptnCreatePaymt,
  SubCreatePaymtPayload,
  UpdateStatusPayload,
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
  retrySubscriptionPayment(data: RetryPaymntPayload): Promise<ReturnRetryPaymntPayload>;
  updateRefundStatusPayment(data: UpdateStatusPayload): Promise<IPickupRequestDocument>;
  refundPayment(plantId: string, data: RefundDataReq): Promise<IPickupRequestDocument>;
}

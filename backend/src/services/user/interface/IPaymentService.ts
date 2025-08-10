import { PaginationInput } from "../../../dtos/common/commonDTO";
import { CreatePaymentReq, CreatePaymentResp, VerifyPaymentReq, VerifyPaymentResp } from "../../../dtos/pickupReq/paymentDTO";
import { PickupPaymentSummaryDTO } from "../../../dtos/pickupReq/pickupReqDTO";
import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";

export interface IPaymentService {
  createPaymentOrderService(
  data: CreatePaymentReq
  ): Promise<CreatePaymentResp>;

  verifyPaymentService(data: VerifyPaymentReq): Promise<VerifyPaymentResp>;

  getAllPayments(userId: string, paginationData: PaginationInput): Promise<{payments: PickupPaymentSummaryDTO[], total: number}>;

  rePaymentService(
    userId: string,
    pickupReqId: string,
    amount: number
  ): Promise<{
    orderId: string | null;
    amount: number | null;
    currency: string;
    pickupReqId: string;
    expiresAt: string;
  }>;
}
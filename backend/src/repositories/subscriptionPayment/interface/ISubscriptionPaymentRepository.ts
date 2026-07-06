import { CreateSubsptnPaymentPayload, ISubscriptionPaymentDocument, PaymentUpdate, SubscriptionPaymentHisRepoResp, UpdateRefundStatusRepoReq, UpdateSubscptnPayload } from "../../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { PaginationInputReq } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface ISubscriptionPaymentRepository {
  createSubscriptionPayment(
    data: CreateSubsptnPaymentPayload,
  ): Promise<ISubscriptionPaymentDocument>;
  updateSubscriptionPayment(
    data: UpdateSubscptnPayload,
  ): Promise<ISubscriptionPaymentDocument>;
  findSubscriptionPayments(
    plantId: string,
  ): Promise<ISubscriptionPaymentDocument[] | null>;
  findSubscriptionPaymentById(
    id: string,
  ): Promise<ISubscriptionPaymentDocument | null>;
  updateSubscriptionPaymentById(
    id: string,
    paymentUpdate: PaymentUpdate,
  ): Promise<ISubscriptionPaymentDocument>;
  findPaidSubscriptionPayments(): Promise<
    ISubscriptionPaymentDocument[] | null
  >;
  getAllSubscptnPayments(
    data: PaginationInputReq,
  ): Promise<SubscriptionPaymentHisRepoResp>;
  findLatestInProgressPayment(
    plantId: string,
  ): Promise<ISubscriptionPaymentDocument | null>;
  findPlantSubscriptionPayment(
    plantId: string,
  ): Promise<ISubscriptionPaymentDocument | null>;
  updateSubptnPaymentStatus(
    subPayId: string,
  ): Promise<ISubscriptionPaymentDocument>;
  updateRefundStatusPayment(
    data: UpdateRefundStatusRepoReq,
  ): Promise<ISubscriptionPaymentDocument>;
}

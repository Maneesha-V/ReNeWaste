import { PaginationInput } from "../../../dtos/common/commonDTO";
import { PaymentUpdate, UpdateSubscptnPayload } from "../../../dtos/pickupReq/paymentDTO";
import { CreateSubsptnPaymentPayload, SubscriptionPaymentHisResult, UpdateRefundStatusReq } from "../../../dtos/subscription/subscptnPaymentDTO";
import { ISubscriptionPaymentDocument } from "../../../models/subsptnPayment/interface/subsptnPaymentInterface";

export  interface ISubscriptionPaymentRepository {
createSubscriptionPayment(
    data: CreateSubsptnPaymentPayload
  ): Promise<ISubscriptionPaymentDocument>;
  updateSubscriptionPayment(data: UpdateSubscptnPayload): Promise<ISubscriptionPaymentDocument>;
  findSubscriptionPayments(plantId: string): Promise<ISubscriptionPaymentDocument[] |null>;
  findSubscriptionPaymentById(id: string): Promise<ISubscriptionPaymentDocument | null>;
  updateSubscriptionPaymentById(id: string, paymentUpdate: PaymentUpdate): Promise<ISubscriptionPaymentDocument>;
  findPaidSubscriptionPayments(): Promise<ISubscriptionPaymentDocument[] |null>;
  getAllSubscptnPayments(data: PaginationInput): Promise<SubscriptionPaymentHisResult>;
  findLatestInProgressPayment(plantId: string): Promise<ISubscriptionPaymentDocument | null>;
  findPlantSubscriptionPayment(plantId: string): Promise<ISubscriptionPaymentDocument | null>;
  updateSubptnPaymentStatus(subPayId: string): Promise<ISubscriptionPaymentDocument>;
  updateRefundStatusPayment(data: UpdateRefundStatusReq): Promise<ISubscriptionPaymentDocument>;
}
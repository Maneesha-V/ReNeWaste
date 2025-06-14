import { ISubscriptionPaymentDocument } from "../../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { PaymentUpdate, UpdateSubscptnPayload } from "../../../types/wastePlant/paymentTypes";
import { CreateSubsptnPaymentPayload } from "../types/subscriptnPaymentTypes";

export  interface ISubscriptionPaymentRepository {
createSubscriptionPayment(
    data: CreateSubsptnPaymentPayload
  ): Promise<ISubscriptionPaymentDocument>;
  updateSubscriptionPayment(data: UpdateSubscptnPayload): Promise<ISubscriptionPaymentDocument>;
  findSubscriptionPayments(plantId: string, planId: string): Promise<ISubscriptionPaymentDocument[] |null>;
  findSubscriptionPaymentById(id: string): Promise<ISubscriptionPaymentDocument | null>;
  updateSubscriptionPaymentById(id: string, paymentUpdate: PaymentUpdate): Promise<ISubscriptionPaymentDocument>;
}
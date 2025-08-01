import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "./interface/IPaymentService";
import { PaginationInput } from "../../dtos/common/commonDTO";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { PaginatedReturnPaymentHis, SubscriptionPaymentHisResult } from "../../dtos/subscription/subscptnPaymentDTO";
import { SubscriptionPaymentMapper } from "../../mappers/SubscriptionPaymentMapper";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
       @inject(TYPES.SubscriptionPaymentRepository)
    private subscriptionPaymentRepository: ISubscriptionPaymentRepository 
  ) {}
   async fetchPayments(
      data: PaginationInput
    ): Promise<SubscriptionPaymentHisResult> {
      const paymentHisData = await this.subscriptionPaymentRepository.getAllSubscptnPayments(data);
      if (!paymentHisData) {
        throw new Error("Payment history not found.");
      }
  
     return paymentHisData;
    }
}
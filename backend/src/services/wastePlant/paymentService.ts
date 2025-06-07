import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "./interface/IPaymentService";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { PaymentRecord } from "../../repositories/pickupReq/types/pickupTypes";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
  ) {}
  async fetchPayments(plantId: string): Promise<PaymentRecord[]> {
    return await this.pickupRepository.fetchAllPaymentsByPlantId(plantId)
  }
}
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/wastePlant/interface/IPaymentService";


@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.PlantPaymentService)
    private paymentService: IPaymentService
  ) {}
}
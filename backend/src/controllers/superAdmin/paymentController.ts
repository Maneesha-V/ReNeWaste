import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/superAdmin/interface/IPaymentService";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.SuperAdminPaymentService)
    private paymentService: IPaymentService
  ) {}
}
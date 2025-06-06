import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "./interface/IPaymentService";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(

  ) {}
}
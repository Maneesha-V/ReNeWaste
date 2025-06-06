import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/superAdmin/interface/ISubscriptionService";


@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SuperAdminSubscriptionService)
    private subscriptionService: ISubscriptionService
  ) {}
}
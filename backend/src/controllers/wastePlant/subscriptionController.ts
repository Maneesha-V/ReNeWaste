import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/wastePlant/interface/ISubscriptionService";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.PlantSubscriptionService)
    private subscriptionService: ISubscriptionService
  ) {}
}
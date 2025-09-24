import { SubsptnPlansDTO } from "../dtos/subscription/subscptnPlanDTO";
import { ISubscriptionPlanDocument } from "../models/subscriptionPlans/interfaces/subsptnPlanInterface";

export class SubscriptionPlanMapper {
  static mapSubscptnPlanDTO(doc: ISubscriptionPlanDocument): SubsptnPlansDTO {
    return {
      _id: doc._id.toString(),
      planName: doc.planName.toString(),
      status: doc.status ?? "Inactive",
      price: doc.price ?? 0,
      billingCycle: doc.billingCycle.toString(),
      description: doc.description.toString(),
      driverLimit: doc.driverLimit ?? 0,
      userLimit: doc.userLimit ?? 0,
      truckLimit: doc.truckLimit ?? 0,
      trialDays: doc.trialDays ?? 0,
      isDeleted: doc.isDeleted ?? false,
    };
  }
  static mapSubscptnPlansDTO(
    docs: ISubscriptionPlanDocument[],
  ): SubsptnPlansDTO[] {
    return docs.map((doc) => this.mapSubscptnPlanDTO(doc));
  }
}

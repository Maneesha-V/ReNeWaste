import { model } from "mongoose";
import { ISubscriptionPlanDocument } from "./interfaces/subsptnPlanInterface";
import { SubscriptionPlanSchema } from "./subscriptionPlanSchema";

export const SubscriptionPlanModel =  model<ISubscriptionPlanDocument>('SubscriptionPlan', SubscriptionPlanSchema);
import { model } from "mongoose";
import { ISubscriptionPaymentDocument } from "./interface/subsptnPaymentInterface";
import { SubscriptionPaymentSchema } from "./subsptnPaymentSchema";

export const SubscriptionPaymentModel =  model<ISubscriptionPaymentDocument>('SubscriptionPayment', SubscriptionPaymentSchema);
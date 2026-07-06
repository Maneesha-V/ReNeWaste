import { Document, Types } from "mongoose";

export interface ISubscriptionPlan extends Document {
  planName: string;
  price: number;
  billingCycle: "Monthly" | "Yearly";
  description: string;
  driverLimit: number;
  userLimit: number;
  truckLimit: number;
  trialDays: number;
  status?: "Active" | "Inactive";
  isDeleted?: boolean;
  createdAt: Date;
}
export interface ISubscriptionPlanDocument extends ISubscriptionPlan, Document {
  _id: Types.ObjectId;
}

export type SubsptnPlanData = {
  billingCycle: string;
  description: string;
  driverLimit: number;
  planName: string;
  price: number;
  trialDays: number;
  truckLimit: number;
  userLimit: number;
  status?: string;
  isDeleted?: boolean;
};

export type updateSubscptnData = {
  id: string;
  data: Partial<SubsptnPlanData>;
};

export type PaginatedSubsptnPlansResult = {
  subscriptionPlans: ISubscriptionPlanDocument[];
  total: number;
};

export interface UpdateSubsptnPlans {
  _id: string | Types.ObjectId;
  billingCycle?: string;
  description?: string;
  driverLimit?: number;
  planName?: string;
  price?: number;
  trialDays?: number;
  truckLimit?: number;
  userLimit?: number;
  status?: string;
  isDeleted?: boolean;
}
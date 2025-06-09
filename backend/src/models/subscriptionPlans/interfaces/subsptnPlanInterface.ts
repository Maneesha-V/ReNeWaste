import mongoose, { Document, Types } from "mongoose";

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

import { injectable } from "inversify";
import {
  ISubscriptionPlan,
  ISubscriptionPlanDocument,
  updateSubscptnData,
  UpdateSubsptnPlans,
} from "../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import BaseRepository from "../baseRepository/baseRepository";
import { ISubscriptionPlanRepository } from "./interface/ISubscriptionPlanRepository";
import { SubscriptionPlanModel } from "../../models/subscriptionPlans/subscriptionPlanModel";
import { FilterQuery } from "mongoose";
import { PaginationInputReq } from "../../models/wastePlant/interfaces/wastePlantInterface";

@injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlanDocument>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlanModel);
  }
  async createSubscriptionPlan(
    data: UpdateSubsptnPlans,
  ): Promise<ISubscriptionPlanDocument> {
    const newSubscriptionPlan = new this.model(data);
    return await newSubscriptionPlan.save();
  }
  async checkPlanNameExist(
    planName: string,
  ): Promise<ISubscriptionPlanDocument | null> {
    return await this.model.findOne({
      planName: new RegExp(`^${planName}$`, "i"),
    });
  }
  async getAllSubscriptionPlans(data: PaginationInputReq) {
    const { page, limit, search } = data;
    const searchRegex = new RegExp(search, "i");
    const query: FilterQuery<ISubscriptionPlan> = {
      isDeleted: false,
      $or: [
        { planName: { $regex: searchRegex } },
        { billingCycle: { $regex: searchRegex } },
        { status: { $regex: searchRegex } },
      ],
    };
    if (!isNaN(Number(search))) {
      query.$or?.push({ price: Number(search) });
    }
    const skip = (page - 1) * limit;

    const subscriptionPlans = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(query);
    return { subscriptionPlans, total };
  }
  async getActiveSubscriptionPlans(): Promise<ISubscriptionPlanDocument[]> {
    return this.model.find({ isDeleted: false, status: "Active" });
  }
  async deleteSubscriptionPlanById(planId: string) {
    // const updatedData = await this.model.findByIdAndDelete(planId);
    const updatedData = await this.model.findByIdAndUpdate(
      planId,
      { isDeleted: true, status: "Inactive" },
      { new: true },
    );
    if (!updatedData) {
      throw new Error("Subscription plan is not deleted.");
    }
    return updatedData;
  }
  async getSubscriptionPlanById(planId: string) {
    const plan = await this.model.findById(planId);
    if (!plan) {
      throw new Error("Plan not found.");
    }
    return plan;
  }
  async updateSubscriptionPlanById({ id, data }: updateSubscptnData) {
    const updatedPlan = await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!updatedPlan) {
      throw new Error("Subscription plan not found");
    }

    return updatedPlan;
  }
}

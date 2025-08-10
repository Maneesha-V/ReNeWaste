import { inject, injectable } from "inversify";
import {
  ISubscriptionPlan,
  ISubscriptionPlanDocument,
} from "../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import BaseRepository from "../baseRepository/baseRepository";
import { ISubscriptionPlanRepository } from "./interface/ISubscriptionPlanRepository";
import { SubscriptionPlanModel } from "../../models/subscriptionPlans/subscriptionPlanModel";
import { updateSubscptnData } from "../../types/superAdmin/subscriptionTypes";

@injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlanDocument>
  implements ISubscriptionPlanRepository
{
  constructor()
  {
    super(SubscriptionPlanModel);
  }
  async createSubscriptionPlan(
    data: ISubscriptionPlan
  ): Promise<ISubscriptionPlanDocument> {
    const newSubscriptionPlan = new this.model(data);
    return await newSubscriptionPlan.save();
  }
  async checkPlanNameExist(
    planName: string
  ): Promise<ISubscriptionPlanDocument | null> {
    return await this.model.findOne({
      planName: new RegExp(`^${planName}$`, "i"),
    });
  }
  async getAllSubscriptionPlans() {
    return this.model.find();
    // await this.model.find({isDeleted: false})
  }
  async getActiveSubscriptionPlans(): Promise<ISubscriptionPlanDocument[]>{
    return this.model.find({isDeleted: false, status: "Active"})
  }
  async deleteSubscriptionPlanById(planId: string) {
    return await this.model.findByIdAndDelete(planId);
    // const updatedData = await this.model.findByIdAndUpdate(
    //   planId,
    // { isDeleted: true },
    // { new: true }
    //   )
    // return updatedData
  }
  async getSubscriptionPlanById(planId: string) {
    return await this.model.findById(planId);
  }
  async updateSubscriptionPlanById({ id, data }: updateSubscptnData) {
    const updatedPlan = await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updatedPlan) {
      throw new Error("Subscription plan not found");
    }

    return updatedPlan;
  }
}

import { inject, injectable } from "inversify";
import BaseRepository from "../baseRepository/baseRepository";
import { ISubscriptionPaymentDocument } from "../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { SubscriptionPaymentModel } from "../../models/subsptnPayment/subsptnPaymentModel";
import { ISubscriptionPaymentRepository } from "./interface/ISubscriptionPaymentRepository";
import { CreateSubsptnPaymentPayload } from "./types/subscriptnPaymentTypes";
import { PaymentUpdate, UpdateSubscptnPayload } from "../../types/wastePlant/paymentTypes";
import mongoose from "mongoose";

@injectable()
export class SubscriptionPaymentRepository
  extends BaseRepository<ISubscriptionPaymentDocument>
  implements ISubscriptionPaymentRepository
{
  constructor() {
    super(SubscriptionPaymentModel);
  }
  async createSubscriptionPayment(
    data: CreateSubsptnPaymentPayload
  ): Promise<ISubscriptionPaymentDocument> {
    const { plantId, planId, amount, paymentDetails } = data;
    const newPayment = new this.model({
      wasteplantId: plantId,
      planId: planId,
      amount: amount,
      ...paymentDetails,
    });

    await newPayment.save();
    return newPayment;
  }
  async updateSubscriptionPayment(data: UpdateSubscptnPayload){
    const { planId, paymentUpdate, plantId } = data;
    const updatedPayment = await this.model.findOneAndUpdate(
    {
      planId: planId,
      wasteplantId: plantId,
    },
    {
      $set: paymentUpdate,
    },
    {
      new: true, 
    }
  );

  if (!updatedPayment) {
    throw new Error("Subscription payment not found for update.");
  }

  return updatedPayment;
  }
  async findSubscriptionPayments(plantId: string, planId: string): Promise<ISubscriptionPaymentDocument[] |null> {
    return await this.model.find({
        wasteplantId: plantId,
        planId
    })
  }
  async findSubscriptionPaymentById(id: string){
    return await this.model.findById(id);
  }
  async updateSubscriptionPaymentById(id: string, paymentUpdate: PaymentUpdate): Promise<ISubscriptionPaymentDocument>{
   const updatedData = await this.model.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      {
        $set: paymentUpdate
      },{ new: true}
    )
    if (!updatedData) {
    throw new Error("Subscription payment not found for update.");
  }
    return updatedData;
  }
  
}

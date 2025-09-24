import { inject, injectable } from "inversify";
import BaseRepository from "../baseRepository/baseRepository";
import { ISubscriptionPaymentDocument } from "../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { SubscriptionPaymentModel } from "../../models/subsptnPayment/subsptnPaymentModel";
import { ISubscriptionPaymentRepository } from "./interface/ISubscriptionPaymentRepository";
import mongoose, { PipelineStage } from "mongoose";
import { PaginationInput } from "../../dtos/common/commonDTO";
import {
  CreateSubsptnPaymentPayload,
  SubscriptionPaymentHisDTO,
  SubscriptionPaymentHisResult,
  UpdateRefundStatusReq,
} from "../../dtos/subscription/subscptnPaymentDTO";
import { SubscriptionPaymentMapper } from "../../mappers/SubscriptionPaymentMapper";
import {
  PaymentUpdate,
  UpdateSubscptnPayload,
} from "../../dtos/pickupReq/paymentDTO";

@injectable()
export class SubscriptionPaymentRepository
  extends BaseRepository<ISubscriptionPaymentDocument>
  implements ISubscriptionPaymentRepository
{
  constructor() {
    super(SubscriptionPaymentModel);
  }
  async createSubscriptionPayment(
    data: CreateSubsptnPaymentPayload,
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
  async updateSubscriptionPayment(data: UpdateSubscptnPayload) {
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
      },
    );

    if (!updatedPayment) {
      throw new Error("Subscription payment not found for update.");
    }

    return updatedPayment;
  }
  async findSubscriptionPayments(
    plantId: string,
  ): Promise<ISubscriptionPaymentDocument[] | null> {
    return await this.model
      .find({ wasteplantId: plantId })
      .populate({ path: "wasteplantId", select: "plantName ownerName" })
      .populate({ path: "planId", select: "planName billingCycle" });
  }
  async findSubscriptionPaymentById(id: string) {
    return await this.model.findById(id);
  }
  async updateSubscriptionPaymentById(
    id: string,
    paymentUpdate: PaymentUpdate,
  ): Promise<ISubscriptionPaymentDocument> {
    const updatedData = await this.model.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $set: paymentUpdate,
      },
      { new: true },
    );
    if (!updatedData) {
      throw new Error("Subscription payment not found for update.");
    }
    return updatedData;
  }
  async findPaidSubscriptionPayments() {
    return await this.model.find({ status: "Paid" });
  }

  async getAllSubscptnPayments(
    data: PaginationInput,
  ): Promise<SubscriptionPaymentHisResult> {
    const { page, limit, search } = data;
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, "i");
    const date = new Date(search);
    const isValidDate = !isNaN(date.getTime());

    const matchStage: PipelineStage.Match = {
      $match: {
        $or: [
          { status: { $regex: searchRegex } },
          { method: { $regex: searchRegex } },
          { "wasteplant.plantName": { $regex: searchRegex } },
          { "plan.planName": { $regex: searchRegex } },
          ...(isValidDate
            ? [
                {
                  paidAt: {
                    $gte: new Date(date.setHours(0, 0, 0, 0)),
                    $lt: new Date(date.setHours(23, 59, 59, 999)),
                  },
                },
              ]
            : []),
          ...(isNaN(Number(search)) ? [] : [{ amount: Number(search) }]),
        ],
      },
    };

    const baseAggregation: PipelineStage[] = [
      {
        $lookup: {
          from: "wasteplants",
          localField: "wasteplantId",
          foreignField: "_id",
          as: "wasteplant",
        },
      },
      { $unwind: "$wasteplant" },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
    ];

    const aggregation: PipelineStage[] = [
      ...baseAggregation,
      matchStage,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          wasteplantId: "$wasteplant",
          planId: "$plan",
          status: 1,
          method: 1,
          razorpayOrderId: 1,
          razorpayPaymentId: 1,
          razorpaySignature: 1,
          amount: 1,
          paidAt: 1,
          expiredAt: 1,
          refundRequested: 1,
          refundStatus: 1,
          refundAt: 1,
          inProgressExpiresAt: 1,
        },
      },
    ];

    const result = await this.model.aggregate(aggregation);

    const totalAggregation: PipelineStage[] = [
      ...baseAggregation,
      matchStage,
      { $count: "total" },
    ];

    const totalResult = await this.model.aggregate(totalAggregation);
    const total = totalResult[0]?.total || 0;

    return { paymentHis: result, total };
  }
  async findLatestInProgressPayment(plantId: string) {
    const payment = await this.model
      .findOne({
        wasteplantId: plantId,
        status: "InProgress",
      })
      .sort({ createdAt: -1 });
    const now = new Date();
    if (
      payment &&
      payment.inProgressExpiresAt &&
      payment.inProgressExpiresAt < now
    ) {
      payment.status = "Pending";
      payment.inProgressExpiresAt = null;
      await payment.save();
      return null;
    }
    if (
      payment &&
      payment.inProgressExpiresAt &&
      payment.inProgressExpiresAt > now
    ) {
      return payment;
    }
    return null;
  }
  async findPlantSubscriptionPayment(plantId: string) {
    const now = new Date();
    return await this.model.findOne({
      wasteplantId: plantId,
      // status: {$or: ["Paid","Pending"]},
      // expiredAt : {$gt: now}
    });
  }
  async updateSubptnPaymentStatus(
    subPayId: string,
  ): Promise<ISubscriptionPaymentDocument> {
    const updatedSubptnRequest = await this.model.findByIdAndUpdate(
      subPayId,
      {
        $set: {
          refundRequested: true,
        },
      },
      { new: true },
    );

    if (!updatedSubptnRequest) {
      throw new Error("Subscription request not found.");
    }
    return updatedSubptnRequest;
  }
  async updateRefundStatusPayment(
    data: UpdateRefundStatusReq,
  ): Promise<ISubscriptionPaymentDocument> {
    const { subPayId, refundStatus } = data;
    const payment = await this.model.findByIdAndUpdate(
      subPayId,
      {
        $set: {
          refundStatus: refundStatus,
        },
      },
      { new: true },
    );
    if (!payment) {
      throw new Error("Payment not found.");
    }
    return payment;
  }
}

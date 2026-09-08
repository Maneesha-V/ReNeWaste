import {
  PopulatedPlan,
  PopulatedWasteplant,
  SubscriptionPaymentDTO,
  SubscriptionPaymentHisDTO,
} from "../dtos/subscription/subscptnPaymentDTO";
import { ISubscriptionPaymentDocument, PopulatedPaymentDocument } from "../models/subsptnPayment/interface/subsptnPaymentInterface";

export class SubscriptionPaymentMapper {
  static mapSubscptnPaymentDTO(
    doc: ISubscriptionPaymentDocument,
  ): SubscriptionPaymentDTO {
    return {
      _id: doc._id.toString(),
      wasteplantId: doc.wasteplantId.toString(),
      planId: doc.planId.toString(),
      status: doc.status ?? "Pending",
      method: doc.method ?? "",
      razorpayOrderId: doc.razorpayOrderId ?? "",
      razorpayPaymentId: doc.razorpayPaymentId ?? "",
      razorpaySignature: doc.razorpaySignature ?? "",
      amount: doc.amount ?? 0,
      paidAt: doc.paidAt ?? null,
      expiredAt: doc.expiredAt ?? null,
      refundRequested: doc.refundRequested ?? false,
      refundStatus: doc.refundStatus ?? null,
      razorpayRefundId: doc.razorpayRefundId ?? null,
      refundAt: doc.refundAt ?? null,
      createdAt: doc.createdAt ?? null,
      updatedAt: doc.updatedAt ?? null,
    };
  }
 
  static mapPopulatedPaymentHis(
  doc: PopulatedPaymentDocument,
): SubscriptionPaymentHisDTO {
  return {
    _id: doc._id.toString(),

    wasteplantId: {
      _id: doc.wasteplantId._id.toString(),
      plantName: doc.wasteplantId.plantName,
      ownerName: doc.wasteplantId.ownerName,
    },

    planId: {
      _id: doc.planId._id.toString(),
      planName: doc.planId.planName,
      billingCycle: doc.planId.billingCycle,
    },

    status: doc.status ?? "Pending",
    method: doc.method ?? "",
    razorpayOrderId: doc.razorpayOrderId ?? "",
    razorpayPaymentId: doc.razorpayPaymentId ?? "",
    razorpaySignature: doc.razorpaySignature ?? "",
    amount: doc.amount ?? 0,
    paidAt: doc.paidAt ?? null,
    expiredAt: doc.expiredAt ?? null,
    refundRequested: doc.refundRequested ?? false,
    refundStatus: doc.refundStatus ?? null,
    razorpayRefundId: doc.razorpayRefundId ?? null,
    refundAt: doc.refundAt ?? null,
    inProgressExpiresAt: doc.inProgressExpiresAt ?? null,
  };
}
  // static mapPopulatedList(
  //   docs: ISubscriptionPaymentDocument[],
  // ): SubscriptionPaymentHisDTO[] {
  //   return docs.map((doc) => this.mapPopulatedPaymentHis(doc));
  // }
    static mapPopulatedList(
    docs: PopulatedPaymentDocument[],
  ): SubscriptionPaymentHisDTO[] {
    return docs.map((doc) => this.mapPopulatedPaymentHis(doc));
  }
}

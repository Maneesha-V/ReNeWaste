import { PopulatedPlan, PopulatedWasteplant, SubscriptionPaymentDTO, SubscriptionPaymentHisDTO } from "../dtos/subscription/subscptnPaymentDTO";
import { ISubscriptionPaymentDocument } from "../models/subsptnPayment/interface/subsptnPaymentInterface";

export class SubscriptionPaymentMapper {
  static mapSubscptnPaymentDTO(
    doc: ISubscriptionPaymentDocument
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
      refundAt: doc.refundAt ?? null,
      createdAt: doc.createdAt ?? null,
      updatedAt: doc.updatedAt ?? null,
    };
  }
 static mapPopulatedPaymentHis(doc: ISubscriptionPaymentDocument): SubscriptionPaymentHisDTO {
    return {
      _id: doc._id.toString(),
  wasteplantId:
        typeof doc.wasteplantId === "object" && "plantName" in doc.wasteplantId
          ? {
              _id: (doc.wasteplantId as any)._id.toString(),
              plantName: (doc.wasteplantId as any).plantName || "",
            }
          : { _id: "", plantName: "" },

        planId:
        typeof doc.planId === "object" && "planName" in doc.planId
          ? {
              _id: (doc.planId as any)._id.toString(),
              planName: (doc.planId as any).planName || "",
            }
          : { _id: "", planName: "" },

      status: doc.status ?? "Pending",
      method: doc.method ?? "",
      razorpayOrderId: doc.razorpayOrderId ?? "",
      razorpayPaymentId: doc.razorpayPaymentId ?? "",
      razorpaySignature: doc.razorpaySignature ?? "",
      amount: doc.amount ?? 0,
      paidAt: doc.paidAt ?? null,
      expiredAt: doc.expiredAt ?? null,
    };
  }
  static mapPopulatedList(
    docs: ISubscriptionPaymentDocument[]
  ): SubscriptionPaymentHisDTO[] {
    return docs.map((doc) => this.mapPopulatedPaymentHis(doc));
  }
}

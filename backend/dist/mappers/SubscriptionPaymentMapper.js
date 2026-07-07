"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPaymentMapper = void 0;
class SubscriptionPaymentMapper {
    static mapSubscptnPaymentDTO(doc) {
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
    static mapPopulatedPaymentHis(doc) {
        return {
            _id: doc._id.toString(),
            wasteplantId: typeof doc.wasteplantId === "object" && "plantName" in doc.wasteplantId
                ? {
                    _id: doc.wasteplantId._id.toString(),
                    plantName: doc.wasteplantId.plantName || "",
                    ownerName: doc.wasteplantId.ownerName || "",
                }
                : { _id: "", plantName: "", ownerName: "" },
            planId: typeof doc.planId === "object" && "planName" in doc.planId
                ? {
                    _id: doc.planId._id.toString(),
                    planName: doc.planId.planName || "",
                    billingCycle: doc.planId.billingCycle || "",
                }
                : { _id: "", planName: "", billingCycle: "" },
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
    static mapPopulatedList(docs) {
        return docs.map((doc) => this.mapPopulatedPaymentHis(doc));
    }
}
exports.SubscriptionPaymentMapper = SubscriptionPaymentMapper;

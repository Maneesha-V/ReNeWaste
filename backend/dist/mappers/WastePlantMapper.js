"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WastePlantMapper = void 0;
class WastePlantMapper {
    static mapWastePlantDTO(doc) {
        return {
            _id: doc._id.toString(),
            plantName: doc.plantName ?? "",
            ownerName: doc.ownerName ?? "",
            location: doc.location ?? "",
            district: doc.district ?? "",
            taluk: doc.taluk ?? "",
            pincode: doc.pincode ?? "",
            state: doc.state ?? "",
            contactInfo: doc.contactInfo ?? "",
            contactNo: doc.contactNo ?? "",
            email: doc.email ?? "",
            licenseNumber: doc.licenseNumber ?? "",
            capacity: doc.capacity ?? 0,
            status: doc.status ?? "Pending",
            subscriptionPlan: doc.subscriptionPlan ?? "",
            role: doc.role,
            services: Array.isArray(doc.services) ? doc.services : [],
            cloudinaryPublicId: doc.cloudinaryPublicId ?? "",
            isBlocked: doc.isBlocked,
            blockedAt: doc.blockedAt ?? null,
            autoUnblockAt: doc.autoUnblockAt ?? null,
            unblockNotificationSent: doc.unblockNotificationSent,
            autoSubscribeAt: doc.autoSubscribeAt ?? null,
            subscribeNotificationSent: doc.subscribeNotificationSent,
            autoRechargeAt: doc.autoRechargeAt ?? null,
            rechargeNotificationSent: doc.rechargeNotificationSent,
            renewNotificationSent: doc.renewNotificationSent,
        };
    }
}
exports.WastePlantMapper = WastePlantMapper;

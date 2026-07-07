"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
class NotificationMapper {
    static mapNotificationDTO(doc) {
        return {
            _id: doc._id.toString(),
            receiverId: doc.receiverId.toString() ?? "",
            receiverType: doc.receiverType,
            senderId: doc.receiverId.toString() ?? "",
            senderType: doc.senderType,
            message: doc.message ?? "",
            type: doc.type,
            isRead: doc.isRead,
            createdAt: doc.createdAt,
            isMeasured: doc.isMeasured,
        };
    }
    static mapNotificationsDTO(docs) {
        return docs.map((doc) => this.mapNotificationDTO(doc));
    }
}
exports.NotificationMapper = NotificationMapper;

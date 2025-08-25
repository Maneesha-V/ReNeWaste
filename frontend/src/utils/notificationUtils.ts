import { NotificationResp } from "../types/notification/notificationTypes";
import { Notification } from "../types/notificationTypes";

export const extractRefundReason = (notifications: NotificationResp[], pickupId: string): string => {
  const matchingNotification = notifications.find((n) => {
    const messageParts = n.message?.split(" ");
    const extractedPickupId = messageParts?.[1];
    return n.type === "pickup_refund-req" && extractedPickupId === pickupId;
  });

  if (!matchingNotification) {
    throw new Error(`No refund request found for pickup ID: ${pickupId}`);
  }

  if (!matchingNotification.isRead) {
    throw new Error(`Refund request for pickup ID ${pickupId} has not been read yet.`);
  }

  return matchingNotification.message;
};
export const extractSubRefundReason = (notifications: NotificationResp[], subPayId: string): string => {
  const matchingNotification = notifications.find((n) => { 
    const messageParts = n.message.split("-");
    const reason = messageParts [1]
    const paymentId = messageParts[messageParts.length-1]
    console.log({ reason, paymentId});
    return n.type === "subscriptn-refund-req" && paymentId === subPayId;
  })
  if (!matchingNotification) {
    throw new Error(`No refund request found for payment Id: ${subPayId}`);
  }
  return matchingNotification.message;
}
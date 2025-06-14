import { Notification } from "../types/notificationTypes";

export const extractRefundReason = (notifications: Notification[], pickupId: string): string => {
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
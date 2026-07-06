export type NotificationResp = {
  _id: string;
 receiverId: string;
  receiverType: string;
  senderId: string;
  senderType: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  isMeasured: boolean;
};
export type FetchNotificationsResp = {
  notifications: NotificationResp[];
}
export type markAsReadResp = {
  updatedNotification: NotificationResp;
}
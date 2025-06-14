
export type Notification = {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
};
export type MeasureDataPayload = {
  vehicleNumber: string;
  driverName: string;
  returnedAt: string;
  weight?: number;
  notificationId?: string;
};
export type SaveWasteMeasurementPayload = {
  weight: number;
  notificationId: string;
}

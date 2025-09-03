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
export type ReturnWasteMeasurement = {
  notificationId: string;
};
export type SaveWasteMeasurementResp = {
  data: ReturnWasteMeasurement;
  message: string;
}
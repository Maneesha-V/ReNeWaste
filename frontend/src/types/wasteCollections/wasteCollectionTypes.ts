import { MsgSuccessResp } from "../common/commonTypes";

export type WasteCollectionDTO = {
  _id: string;
  driverId: string;
  truckId: string;
  wasteplantId: string;
  measuredWeight: number;
  collectedWeight: number;
  wasteType: string;
  returnedAt: Date | null;
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
};
export type ReturnWasteMeasurement = {
  notificationId: string;
};
export type SaveWasteMeasurementResp = {
  data: ReturnWasteMeasurement;
  message: string;
};
export type FilterWasteReportsResp = MsgSuccessResp & {
  reports: WasteCollectionDTO[];
};
export type FetchWasteReportsResp = MsgSuccessResp & {
  wasteReports: PopWasteCollectionDTO[];
};
export type PopWasteCollectionDTO = {
  _id: string;
  driver: {
    _id: string;
    name: string;
  } | null;
  truck: {
    _id: string;
    name: string;
  } | null;
  wasteplantId: string;
  measuredWeight: number;
  collectedWeight: number;
  wasteType: string;
  returnedAt: Date | null;
};

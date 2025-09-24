import { BaseDTO } from "../base/BaseDTO";

export interface WasteCollectionDTO extends BaseDTO {
  driverId: string;
  truckId: string;
  wasteplantId: string;
  measuredWeight: number;
  collectedWeight: number;
  wasteType: string;
  returnedAt: Date | null;
}
export type InputWasteMeasurement = {
  wasteplantId: string;
  weight: number;
  notificationId: string;
};
export type ReturnWasteMeasurement = {
  notificationId: string;
};
export type ReturnTotalWasteAmount = {
  totalResidWaste: number;
  totalCommWaste: number;
};

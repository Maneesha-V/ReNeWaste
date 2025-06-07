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

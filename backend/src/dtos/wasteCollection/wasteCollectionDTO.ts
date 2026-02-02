import { Types } from "mongoose";
import { IWasteCollectionDocument } from "../../models/wasteCollection/interfaces/wasteCollectionInterface";
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
export interface IWasteCollectionPopulatedDocument
  extends Omit<IWasteCollectionDocument, "driverId" | "truckId"> {
  driverId: {
    _id: Types.ObjectId;
    name: string;
  };
  truckId: {
    _id: Types.ObjectId;
    name: string;
  };
}
export interface PopulatedWasteCollectionDTO extends BaseDTO {
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
}
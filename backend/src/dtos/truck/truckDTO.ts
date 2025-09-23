import { Types } from "mongoose";
import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";
import { BaseDTO } from "../base/BaseDTO";
export interface TruckDTO extends BaseDTO {
    name: string;
    vehicleNumber: string;
    capacity: number;
    assignedDriver?: string;
    wasteplantId?: string;
    status?: string;
    isReturned?: boolean;
    tareWeight: number;
    isDeleted?: boolean;
}
export interface ITruckExtDocument
  extends Omit<ITruckDocument, "wasteplantId">,
    Document {
  _id: Types.ObjectId;
    wasteplantId: {
      _id: Types.ObjectId;
       plantName?: string;
        ownerName?: string;
        location?: string;
        district?: string;
        taluk?: string;
        pincode?: string;
        state?: string;
        contactInfo?: string;
        contactNo?: string;
        email?: string;
        licenseNumber?: string;
        capacity?: number;
        status?: string;
        subscriptionPlan?: string; 
        role: string;
        services?: string[];
        licenseDocumentPath: string;
        cloudinaryPublicId: string;
        isBlocked?: boolean;
        blockedAt?: Date | null;
        autoUnblockAt?: Date | null;
        unblockNotificationSent?: boolean;
        autoSubscribeAt?: Date | null;
        subscribeNotificationSent?: boolean;
        autoRechargeAt?: Date | null;
        rechargeNotificationSent?: boolean;
        renewNotificationSent?: boolean;
    }
  }
  export interface TruckAvailbleDTO extends BaseDTO {
  name: string;
    vehicleNumber: string;
    capacity: number;
    assignedDriver?: string;
    wasteplantId: {
       _id: string;
        plantName?: string;
        ownerName?: string;
        location?: string;
        district?: string;
        taluk?: string;
        pincode?: string;
        state?: string;
        contactInfo?: string;
        contactNo?: string;
        email?: string;
        licenseNumber?: string;
        capacity?: number;
        status?: string;
        subscriptionPlan?: string; 
        role: string;
        services?: string[];
        licenseDocumentPath: string;
        cloudinaryPublicId: string;
        isBlocked?: boolean;
        blockedAt?: Date | null;
        autoUnblockAt?: Date | null;
        unblockNotificationSent?: boolean;
        autoSubscribeAt?: Date | null;
        subscribeNotificationSent?: boolean;
        autoRechargeAt?: Date | null;
        rechargeNotificationSent?: boolean;
        renewNotificationSent?: boolean;
    };
    status?: string;
    isReturned?: boolean;
    tareWeight: number;
    isDeleted?: boolean;
  }
export type PaginatedResult = {
  trucks: TruckDTO[];
  total: number;
}
export type PaginatedTrucksResult = {
  trucks: ITruckDocument[];
  total: number;
}
export type ReturnFetchAllTrucksByPlantId = {
    active: number;
    inactive: number;
    maintenance: number;
}
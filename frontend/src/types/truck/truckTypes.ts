import { MsgSuccessResp } from "../common/commonTypes";
import { DriverDTO } from "../driver/driverTypes";

export type TruckFormData = {
    name: string,
    vehicleNumber: string,
    capacity: number,
    status: "Active" | "Inactive" | "Suspended",
    tareWeight: number,
  }
export type PartialTruckFormData = Partial<TruckFormData>;

export type TruckDTO = {
    _id: string;
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
export type TruckAvailbleDTO = {
    _id: string;
    name: string;
    vehicleNumber: string;
    capacity: number;
    assignedDriver?: string;
    status?: string;
    isReturned?: boolean;
    tareWeight: number;
    isDeleted?: boolean;
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
}
export type FetchTrucksResp = MsgSuccessResp & {
    trucks: TruckDTO[];
    total: number;
}
export type FetchAvailableTrucksResp = MsgSuccessResp & {
    trucks: TruckAvailbleDTO[];
}
export type FetchTruckByIdResp = {
truck : TruckDTO;
}
export  type UpdateTruckResp = MsgSuccessResp & {
    updatedTruck: TruckDTO;
}
export type DeleteTruckResp = MsgSuccessResp & {
    updatedTruck: TruckDTO
}
export type FetchTruckRequestsResp = MsgSuccessResp & {
pendingTruckReqsts: TruckDTO[];
}
export type FetchTrucksForDriverResp = MsgSuccessResp & {
availableTrucks: TruckDTO[];
}
export type AssignTruckToDriverResp = MsgSuccessResp & {
updatedRequests: TruckDTO[];
}
export type FetchDriverTrucksResp = MsgSuccessResp & {
    assignedTruck: TruckAvailbleDTO[];
}
export type ReqTruckByDriverResp = MsgSuccessResp & {
    requestedDriver: DriverDTO;
}


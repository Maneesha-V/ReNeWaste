import { MsgSuccessResp } from "../common/commonTypes";

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
export type FetchTrucksResp = MsgSuccessResp & {
    trucks: TruckDTO[];
    total: number;
}
export type FetchAvailableTrucksResp = MsgSuccessResp & {
    trucks: TruckDTO[];
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

import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupFilterParams } from "../../../types/wastePlant/authTypes";
import { IUpdatePickupRequest } from "../../../types/wastePlant/pickupTypes";

export interface IPickupRepository {
    getPickupById(pickupReqId: string): Promise<IPickupRequestDocument>;
    createPickup(pickupData: Partial<IPickupRequest>): Promise<IPickupRequestDocument>;
    getPickupsByPlantId(filters: PickupFilterParams): Promise<IPickupRequest[]>;
    updatePickupStatusAndDriver(pickupReqId: string,updateData: {status: string; driverId: string; }): Promise<IPickupRequestDocument>;
    updatePickupRequest(pickupReqId: string, updatePayload: IUpdatePickupRequest): Promise<IPickupRequestDocument>;
    updatePickupDate(pickupReqId: string, updateData: any): Promise<IPickupRequestDocument>;
}
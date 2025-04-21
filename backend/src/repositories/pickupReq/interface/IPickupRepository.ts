import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupDriverFilterParams } from "../../../types/driver/pickupTypes";
import { PickupFilterParams } from "../../../types/wastePlant/authTypes";
import { IUpdatePickupRequest } from "../../../types/wastePlant/pickupTypes";
export interface EnhancedPickup extends IPickupRequest {
    userFullName?: string;
    selectedAddress?: any; 
  }
export interface IPickupRepository {
    getPickupById(pickupReqId: string): Promise<IPickupRequestDocument>;
    createPickup(pickupData: Partial<IPickupRequest>): Promise<IPickupRequestDocument>;
    getPickupsByPlantId(filters: PickupFilterParams): Promise<IPickupRequest[]>;
    updatePickupStatusAndDriver(pickupReqId: string,updateData: {status: string; driverId: string; }): Promise<IPickupRequestDocument>;
    updatePickupRequest(pickupReqId: string, updatePayload: IUpdatePickupRequest): Promise<IPickupRequestDocument>;
    updatePickupDate(pickupReqId: string, updateData: any): Promise<IPickupRequestDocument>;
    getPickupsByDriverId(filters: PickupDriverFilterParams): Promise<EnhancedPickup[]>;
}
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
    findPickupByIdAndDriver(pickupReqId: string, driverId: string): Promise<EnhancedPickup | null>;
    updateETAAndTracking(
      pickupReqId: string,
      updateFields: { eta: { text: string; value: number } }
    ): Promise<void>;
    getPickupPlansByUserId(userId: string): Promise<IPickupRequestDocument[]>;
    updateTrackingStatus(pickupReqId: string, trackingStatus: string): Promise<IPickupRequestDocument | null>;
    updatePickupStatus(pickupReqId: string, status: string): Promise<IPickupRequestDocument | null>;
    markPickupCompletedStatus(pickupReqId: string): Promise<IPickupRequestDocument | null>;
    getPickupByUserIdAndPickupReqId(pickupReqId: string, userId: string): Promise<IPickupRequestDocument | null>;
    savePaymentDetails(pickupReqId: string, paymentData: any, userId: string): Promise<IPickupRequestDocument>;
    getAllPaymentsByUser(userId: string): Promise<Partial<IPickupRequest>[]>;
    countByStatus(status: string): Promise<number>;
    calculateTotalRevenueByWastePlant(plantId: string): Promise<number>;
}
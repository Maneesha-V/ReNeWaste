import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { PickupDriverFilterParams } from "../../../types/driver/pickupTypes";
import { PickupFilterParams } from "../../../types/wastePlant/authTypes";
import { PaymentRecord, PickupStatusByWasteType, RevenueByWasteType } from "../types/pickupTypes";
export interface EnhancedPickup extends IPickupRequest {
    userFullName?: string;
    selectedAddress?: any; 
  }
export interface IPickupRepository {
    getPickupById(pickupReqId: string): Promise<IPickupRequestDocument>;
    createPickup(pickupData: Partial<IPickupRequest>): Promise<IPickupRequestDocument>;
    getPickupsByPlantId(filters: PickupFilterParams): Promise<IPickupRequest[]>;
    updatePickupStatusAndDriver(pickupReqId: string,updateData: {status: string; driverId: string; }): Promise<IPickupRequestDocument>;
    updatePickupRequest(pickupReqId: string): Promise<IPickupRequestDocument>;
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
    fetchAllPickupsByPlantId(plantId: string): Promise<PickupStatusByWasteType>;
    totalRevenueByPlantId(plantId: string): Promise<RevenueByWasteType>;
    fetchAllPaymentsByPlantId(plantId: string): Promise<PaymentRecord[]>;
    updatePaymentStatus(pickupReqId: string): Promise<IPickupRequestDocument | null>;
}
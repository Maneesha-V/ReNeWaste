import { PaginationInput } from "../../../dtos/common/commonDTO";
import {
  CheckExistingBusinessReq,
  CheckExistingBusinessResp,
  CheckExistingResidReq,
  IPickupRequestExtDocument,
  PickupDriverFilterParams,
  PickupStatusByWasteType,
  PopulatedPIckupPlans,
  RevenueByWasteType,
} from "../../../dtos/pickupReq/pickupReqDTO";
import { AddressDTO } from "../../../dtos/user/userDTO";
import {
  FetchPaymentPayload,
  FilterReport,
  PaginatedPaymentsResult,
  PickupFilterParams,
} from "../../../dtos/wasteplant/WasteplantDTO";
import {
  IPickupRequest,
  IPickupRequestDocument,
} from "../../../models/pickupRequests/interfaces/pickupInterface";

export interface EnhancedPickup extends IPickupRequest {
  userName?: string;
  userAddress?: AddressDTO;
}
export interface IPickupRepository {
  getPickupById(pickupReqId: string): Promise<IPickupRequestDocument>;
  createPickup(
    pickupData: Partial<IPickupRequest>,
  ): Promise<IPickupRequestDocument>;
  getPickupsByPlantId(
    filters: PickupFilterParams,
  ): Promise<IPickupRequestDocument[]>;
  updatePickupStatusAndDriver(
    pickupReqId: string,
    updateData: { status: string; driverId: string; truckId: string },
  ): Promise<IPickupRequestDocument>;
  updatePickupRequest(pickupReqId: string): Promise<IPickupRequestDocument>;
  updatePickupDate(
    pickupReqId: string,
    updateData: any,
  ): Promise<IPickupRequestDocument>;
  getPickupsByDriverId(
    filters: PickupDriverFilterParams,
  ): Promise<IPickupRequestDocument[]>;
  findPickupByIdAndDriver(
    pickupReqId: string,
    driverId: string,
  ): Promise<IPickupRequestExtDocument>;
  updateETAAndTracking(
    pickupReqId: string,
    updateFields: { eta: { text: string; value: number } },
  ): Promise<void>;
  getPickupPlansByUserId(
    userId: string,
    paginationData: PaginationInput,
  ): Promise<{ pickupPlans: PopulatedPIckupPlans[]; total: number }>;
  updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string,
  ): Promise<IPickupRequestDocument>;
  updatePickupStatus(
    pickupReqId: string,
    status: string,
  ): Promise<IPickupRequestDocument | null>;
  markPickupCompletedStatus(
    pickupReqId: string,
  ): Promise<IPickupRequestDocument | null>;
  getPickupByUserIdAndPickupReqId(
    pickupReqId: string,
    userId: string,
  ): Promise<IPickupRequestDocument | null>;
  // savePaymentDetails({
  //     pickupReqId,
  //     paymentData,
  //     userId,
  //   }: SavePaymentReq): Promise<void>;
  getAllPaymentsByUser(
    userId: string,
    paginationData: PaginationInput,
  ): Promise<{ pickups: Partial<IPickupRequestDocument>[]; total: number }>;
  fetchAllPickupsByPlantId(plantId: string): Promise<PickupStatusByWasteType>;
  totalRevenueByPlantId(plantId: string): Promise<RevenueByWasteType>;
  fetchAllPaymentsByPlantId(
    data: FetchPaymentPayload,
  ): Promise<PaginatedPaymentsResult>;
  updatePaymentStatus(
    pickupReqId: string,
  ): Promise<IPickupRequestDocument | null>;
  getPickupWithUserAndPlantId(
    plantId: string,
    userId: string,
    pickupId: string,
  ): Promise<IPickupRequestDocument | null>;
  filterWasteReportsByPlantId(
    data: FilterReport,
  ): Promise<IPickupRequestDocument[]>;
  fetchWasteReportsByPlantId(
    plantId: string,
  ): Promise<IPickupRequestDocument[]>;
  getDriverTotalPickups(driverId: string): Promise<{
    assignedCount: number;
    completedCount: number;
  }>;
  getMonthlyPickupPlansByUserId(userId: string): Promise<{ count: number }>;
  totalRevenueByMonth(): Promise<{ month: string; totalRevenue: number }[]>;
  getAllPickupsByStatus(plantId: string): Promise<IPickupRequestDocument[]>;
  checkExistingBusiness(
    data: CheckExistingBusinessReq,
  ): Promise<CheckExistingBusinessResp | null>;
  checkExistingResid(
    data: CheckExistingResidReq,
  ): Promise<CheckExistingBusinessResp | null>;
}

import { ClientSession } from "mongoose";
import {
  IPickupRequestExtDocument,
  modCommPickReq,
  PickupStatusByWasteType,
} from "../../../dtos/pickupReq/pickupReqDTO";
import { AddressDTO } from "../../../dtos/user/userDTO";
import {
  CheckExistingBusinessReq,
  CheckExistingBusinessResp,
  CheckExistingResidReq,
  FetchWPDashboardRepo,
  FilterReportRepo,
  FindDriverPlantTruckByIdReq,
  IPickupRequest,
  IPickupRequestDocument,
  modCommPickData,
  PickupDriverFilterParamsRepo,
  PickupFilterParamsRepo,
  PickupTrendResultRepo,
  PopulatedPIckupPlansRepo,
  PopulatedUserPickupReqRepo,
} from "../../../models/pickupRequests/interfaces/pickupInterface";
import { FetchPaymentPayloadRepo, PaginatedPaymentsResultRepo } from "../../../models/pickupRequests/interfaces/paymentInterface";
import { PaginationInputReq } from "../../../models/wastePlant/interfaces/wastePlantInterface";

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
    filters: PickupFilterParamsRepo,
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
    filters: PickupDriverFilterParamsRepo,
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
    paginationData: PaginationInputReq,
  ): Promise<{ pickupPlans: PopulatedPIckupPlansRepo[]; total: number }>;
  updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string,
  ): Promise<IPickupRequestDocument>;
  updatePickupStatus(
    pickupReqId: string,
    status: string,
  ): Promise<IPickupRequestDocument | null>;
  markPickupCompletedStatus(
    pickupReqId: string, session?: ClientSession
  ): Promise<IPickupRequestDocument | null>;
  getPickupByUserIdAndPickupReqId(
    pickupReqId: string,
    userId: string,
  ): Promise<IPickupRequestDocument | null>;
  getAllPaymentsByUser(
    userId: string,
    paginationData: PaginationInputReq,
  ): Promise<{ pickups: Partial<IPickupRequestDocument>[]; total: number }>;
  fetchAllPickupsByPlantId(plantId: string): Promise<PickupStatusByWasteType>;
  fetchAllPaymentsByPlantId(
    data: FetchPaymentPayloadRepo,
  ): Promise<PaginatedPaymentsResultRepo>;
  updatePaymentStatus(
    pickupReqId: string,
  ): Promise<IPickupRequestDocument | null>;
  getPickupWithUserAndPlantId(
    plantId: string,
    userId: string,
    pickupId: string,
  ): Promise<IPickupRequestDocument | null>;
  filterWasteReportsByPlantId(
    data: FilterReportRepo,
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
  findDriverPlantTruckById(data: FindDriverPlantTruckByIdReq): Promise<IPickupRequestDocument[]>;
  getDriverCompletedPickups(driverId: string): Promise<PopulatedUserPickupReqRepo[]>;
  fetchAllCompletedPickups(data: FetchWPDashboardRepo): Promise<PickupTrendResultRepo[]>;
  getRecurringPickups(): Promise<IPickupRequestDocument[]>;
  getLatestRecurringPickup(parentPickupId: string): Promise<IPickupRequestDocument | null>;
  existsRecurringPickup(
    parentPickupId: string,
    pickupDate: Date
  ): Promise<boolean>;
}

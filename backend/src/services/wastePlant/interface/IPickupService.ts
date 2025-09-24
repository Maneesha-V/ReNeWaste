import { DriverDTO } from "../../../dtos/driver/driverDTO";
import {
  PickupReqDTO,
  PickupReqGetDTO,
} from "../../../dtos/pickupReq/pickupReqDTO";
import {
  ApprovePickupDTO,
  PickupFilterParams,
  ReschedulePickupDTO,
} from "../../../dtos/wasteplant/WasteplantDTO";

export interface IPickupService {
  getPickupRequestService(
    filters: PickupFilterParams,
  ): Promise<PickupReqGetDTO[]>;
  approvePickupService(data: ApprovePickupDTO): Promise<PickupReqDTO>;
  cancelPickupRequest(
    plantId: string,
    pickupReqId: string,
    reason: string,
  ): Promise<PickupReqDTO>;
  reschedulePickup(
    wasteplantId: string,
    pickupReqId: string,
    data: ReschedulePickupDTO,
  ): Promise<PickupReqDTO>;
  getAvailableDriverService(
    location: string,
    plantId: string,
  ): Promise<DriverDTO[]>;
}

import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import {
  ApprovePickupDTO,
  IUpdatePickupRequest,
  ReschedulePickupDTO,
} from "../../types/wastePlant/pickupTypes";
import { IPickupService } from "./interface/IPickupService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ) {}
  async getPickupRequestService(
    filters: PickupFilterParams
  ): Promise<IPickupRequest[]> {
    return await this.pickupRepository.getPickupsByPlantId(filters);
  }

  async approvePickupService(data: ApprovePickupDTO) {
    const { pickupReqId, status, driverId, assignedTruckId } = data;

    const updatedPickup =
      await this.pickupRepository.updatePickupStatusAndDriver(pickupReqId, {
        status,
        driverId,
      });

    if (!updatedPickup) throw new Error("Pickup  not found or update failed");

    await this.driverRepository.updateDriverTruck(driverId, assignedTruckId);

    return updatedPickup;
  }
  async cancelPickupRequest(pickupReqId: string, status: string) {
    try {
      const updatePayload: IUpdatePickupRequest = {
        status,
      };

      const updatedPickupRequest =
        await this.pickupRepository.updatePickupRequest(
          pickupReqId,
          updatePayload
        );
      return updatedPickupRequest;
    } catch (error) {
      console.error(error);
      throw new Error("Error in cancelling the pickup request.");
    }
  }
  async reschedulePickup(pickupReqId: string, data: ReschedulePickupDTO) {
    const existingPickup = await this.pickupRepository.getPickupById(
      pickupReqId
    );

    if (!existingPickup) {
      throw new Error("Pickup request not found");
    }

    await this.driverRepository.updateDriverAssignedZone(
      data.driverId,
      data.assignedZone
    );
    const updatedPickup = await this.pickupRepository.updatePickupDate(
      pickupReqId,
      {
        driverId: data.driverId,
        rescheduledPickupDate: data.rescheduledPickupDate,
        status: data.status,
      }
    );
    if (!updatedPickup) {
      throw new Error("Failed to reschedule pickup");
    }
    return updatedPickup;
  }
  async getAvailableDriverService(location: string, plantId: string) {
    return await this.driverRepository.getDriversByLocation(location, plantId);
  }
}

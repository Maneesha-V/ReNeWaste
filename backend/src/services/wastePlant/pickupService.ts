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
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
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
    const driver = await this.driverRepository.getDriverById(driverId);
    const truck = await this.truckRepository.getTruckById(assignedTruckId);

    if (!driver || !truck) throw new Error("Driver or Truck not found");
    const plant = await this.wastePlantRepository.getWastePlantById(
      driver.wasteplantId!.toString()
    );

    if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
      throw new Error(
        "Driver's plant does not match pickup's plant. Skipping notification."
      );
    }
    const message = `New pickup task assigned: Truck ${truck.vehicleNumber} from ${plant.plantName}.`;
    const notification = await this.notificationRepository.createNotification({
      receiverId: driverId,
      receiverType: "driver",
      message,
      type: "pickup_scheduled",
    });
    console.log("notification", notification);

    const io = global.io;

    if (io) {
      io.to(`${driverId}`).emit("newNotification", notification);
    }

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
  async reschedulePickup(
    wasteplantId: string,
    pickupReqId: string,
    data: ReschedulePickupDTO
  ) {
    const existingPickup = await this.pickupRepository.getPickupById(
      pickupReqId
    );

    if (!existingPickup) {
      throw new Error("Pickup request not found");
    }
    if (existingPickup?.wasteplantId?.toString() !== wasteplantId.toString()) {
      throw new Error("Pickup not belongs this wasteplant.");
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
        pickupTime: data.pickupTime,
        status: data.status,
      }
    );
    if (!updatedPickup) {
      throw new Error("Failed to reschedule pickup");
    }
    const plant = await this.wastePlantRepository.getWastePlantById(
      wasteplantId
    );

    if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
      throw new Error(
        "Driver's plant does not match pickup's plant. Skipping notification."
      );
    }
    const message = `Pickup ${updatedPickup.pickupId} is rescheduled to you from ${plant.plantName}.`;
    const notification = await this.notificationRepository.createNotification({
      receiverId: data.driverId,
      receiverType: "driver",
      message,
      type: "pickup_rescheduled",
    });
    console.log("notification", notification);

    const io = global.io;

    if (io) {
      io.to(`${data.driverId}`).emit("newNotification", notification);
    }

    return updatedPickup;
  }
  async getAvailableDriverService(location: string, plantId: string) {
    return await this.driverRepository.getDriversByLocation(location, plantId);
  }
}

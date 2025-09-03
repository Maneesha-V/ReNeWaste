import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import { IPickupService } from "./interface/IPickupService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { setDriver } from "mongoose";
import { ApprovePickupDTO, PickupFilterParams, ReschedulePickupDTO } from "../../dtos/wasteplant/WasteplantDTO";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { PickupReqDTO } from "../../dtos/pickupReq/pickupReqDTO";
import { DriverMapper } from "../../mappers/DriverMapper";

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
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionplanRepository: ISubscriptionPlanRepository
  ) {}
  async getPickupRequestService(
    filters: PickupFilterParams
  ): Promise<PickupReqDTO[]> {
    const pickups =  await this.pickupRepository.getPickupsByPlantId(filters);
    return PickupRequestMapper.mapPickupReqsDTO(pickups);
  }

  async approvePickupService(data: ApprovePickupDTO) {
    const { plantId, pickupReqId, status, driverId, assignedTruckId } = data;
    const totalUserCount = await this.userRepository.fetchAllUsersByPlantId(
      plantId
    );
    console.log("totalUserCount", totalUserCount);

    const existingPlant = await this.wastePlantRepository.getWastePlantById(
      plantId
    );
    console.log("existingPlant", existingPlant);
    if (!existingPlant) {
      throw new Error("Plant not found.");
    }
    if (existingPlant.status === "Active") {
      const purchasedPlan =
        await this.subscriptionplanRepository.checkPlanNameExist(
          existingPlant.subscriptionPlan!
        );
      if (!purchasedPlan) {
        throw new Error("Subscription plan not found.");
      }
      if (totalUserCount >= purchasedPlan?.userLimit) {
        throw new Error(
          `You can't approve this request bcoz your plan user limit is ${purchasedPlan?.userLimit}.`
        );
      }
    }

    const updatedPickup =
      await this.pickupRepository.updatePickupStatusAndDriver(pickupReqId, {
        status,
        driverId,
        truckId: assignedTruckId,
      });

    if (!updatedPickup) throw new Error("Pickup  not found or update failed");

    if (updatedPickup.wasteplantId?.toString() !== plantId) {
      throw new Error("Pickup  not belongs to this wasteplant");
    }

    await this.driverRepository.updateDriverTruck(driverId, assignedTruckId);
    const driver = await this.driverRepository.getDriverById(driverId);
    const truck = await this.truckRepository.getTruckById(assignedTruckId);

    if (!driver || !truck) throw new Error("Driver or Truck or User not found");
    const plant = await this.wastePlantRepository.getWastePlantById(
      driver.wasteplantId!.toString()
    );

    if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
      throw new Error(
        "Driver's plant does not match pickup's plant. Skipping notification."
      );
    }

    const io = global.io;

    const driverMessage = `New pickup task assigned: Truck ${truck.vehicleNumber} from ${plant.plantName}.`;
    const driverNotification =
      await this.notificationRepository.createNotification({
        receiverId: driverId,
        receiverType: "driver",
        senderId: plantId,
        senderType: "wasteplant",
        message: driverMessage,
        type: "pickup_scheduled",
      });
    console.log("driverNotification", driverNotification);

    if (io) {
      io.to(`${driverId}`).emit("newNotification", driverNotification);
    }
    const userId = updatedPickup.userId.toString();
    const userMessage = `Your pickup request has been approved. Driver ${driver.name} with truck ${truck.vehicleNumber} is assigned.`;
    const userNotification =
      await this.notificationRepository.createNotification({
        receiverId: userId,
        receiverType: "user",
        senderId: plantId,
        senderType: "wasteplant",
        message: userMessage,
        type: "pickup_approved",
      });

    console.log("userNotification", driverNotification);

    if (io) {
      io.to(`${userId}`).emit("newNotification", userNotification);
    }

    return PickupRequestMapper.mapPickupReqDTO(updatedPickup);
  }
  async cancelPickupRequest(
    plantId: string,
    pickupReqId: string,
    reason: string
  ) {
      const updatedPickupRequest =
        await this.pickupRepository.updatePickupRequest(pickupReqId);

      const io = global.io;

      const userId = updatedPickupRequest.userId.toString();
      const userMessage = `Your pickup ID ${updatedPickupRequest.pickupId} is cancelled.${reason}`;
      const userNotification =
        await this.notificationRepository.createNotification({
          receiverId: userId,
          receiverType: "user",
          senderId: plantId,
          senderType: "wasteplant",
          message: userMessage,
          type: "pickup_cancelled",
        });
      console.log("userNotification", userNotification);

      if (io) {
        io.to(`${userId}`).emit("newNotification", userNotification);
      }

      return PickupRequestMapper.mapPickupReqDTO(updatedPickupRequest);
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
    const driver = await this.driverRepository.updateDriverAssignedZone(
      data.driverId,
      data.assignedZone
    );

    if (!driver) {
      throw new Error("Driver not found.");
    }
    const truckId = driver?.assignedTruckId;
    if (!truckId) {
      throw new Error("Truck ID is missing for the assigned driver.");
    }
    const truck = await this.truckRepository.getTruckById(truckId.toString());

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
    const io = global.io;

    const driverMessage = `Pickup ${updatedPickup.pickupId} is rescheduled to you from ${plant.plantName}.`;
    const driverNotification =
      await this.notificationRepository.createNotification({
        receiverId: data.driverId,
        receiverType: "driver",
        senderId: wasteplantId,
        senderType: "wasteplant",
        message: driverMessage,
        type: "pickup_rescheduled",
      });
    console.log("driverNotification", driverNotification);

    if (io) {
      io.to(`${data.driverId}`).emit("newNotification", driverNotification);
    }

    const userId = existingPickup.userId.toString();
    const userMessage = `Your pickup ID ${updatedPickup.pickupId} is rescheduled. Driver ${driver.name} with truck ${truck?.vehicleNumber} is assigned.`;
    const userNotification =
      await this.notificationRepository.createNotification({
        receiverId: userId,
        receiverType: "user",
        senderId: wasteplantId,
        senderType: "wasteplant",
        message: userMessage,
        type: "pickup_rescheduled",
      });
    console.log("userNotification", userNotification);

    if (io) {
      io.to(`${userId}`).emit("newNotification", userNotification);
    }
    return PickupRequestMapper.mapPickupReqDTO(updatedPickup);
  }
  async getAvailableDriverService(location: string, plantId: string) {
    const drivers = await this.driverRepository.getDriversByLocation(location, plantId);
    return DriverMapper.mapDriversDTO(drivers);
  }
}

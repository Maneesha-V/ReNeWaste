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
import {
  ApprovePickupDTO,
  PickupFilterParams,
  ReschedulePickupDTO,
} from "../../dtos/wasteplant/WasteplantDTO";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { PickupReqGetDTO } from "../../dtos/pickupReq/pickupReqDTO";
import { DriverMapper } from "../../mappers/DriverMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

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
    private subscriptionplanRepository: ISubscriptionPlanRepository,
  ) {}
  async getPickupRequestService(
    filters: PickupFilterParams,
  ): Promise<PickupReqGetDTO[]> {
    const pickups = await this.pickupRepository.getPickupsByPlantId(filters);
    console.log("WP-Pickups",pickups);
    
    // return PickupRequestMapper.mapPickupReqsGetDTO(pickups);
    return PickupRequestMapper.mapPopulatedPickupReqsDTO(pickups);
  }

  async approvePickupService(data: ApprovePickupDTO) {
    const { plantId, pickupReqId, status, driverId, assignedTruckId } = data;
    const totalUserCount =
      await this.userRepository.fetchAllUsersByPlantId(plantId);

    const existingPlant =
      await this.wastePlantRepository.getWastePlantById(plantId);

    if (!existingPlant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }
    if (existingPlant.status === "Active") {
      const purchasedPlan =
        await this.subscriptionplanRepository.checkPlanNameExist(
          existingPlant.subscriptionPlan!,
        );
      if (!purchasedPlan) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.SUPERADMIN.ERROR.PLAN_NOT_EXIST,
        );
      }
      if (totalUserCount >= purchasedPlan?.userLimit) {
        throw new ApiError(
          STATUS_CODES.CONFLICT,
          `You can't approve this request bcoz your plan user limit is ${purchasedPlan?.userLimit}.`,
        );
      }
    }

    const updatedPickup =
      await this.pickupRepository.updatePickupStatusAndDriver(pickupReqId, {
        status,
        driverId,
        truckId: assignedTruckId,
      });

    if (!updatedPickup) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.PICKUP_FAILED,
      );
    }

    if (updatedPickup.wasteplantId?.toString() !== plantId) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        MESSAGES.SUPERADMIN.ERROR.NOT_IN_PLANT,
      );
    }

    await this.driverRepository.updateDriverTruck(driverId, assignedTruckId);
    const driver = await this.driverRepository.getDriverById(driverId);
    const truck = await this.truckRepository.getTruckById(assignedTruckId);

    if (!driver || !truck) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, "Driver or Truck not found");
    }
    const plant = await this.wastePlantRepository.getWastePlantById(
      driver.wasteplantId!.toString(),
    );

    if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        "Driver's plant does not match pickup's plant. Skipping notification.",
      );
    }

    const io = globalThis.io;

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

    if (io) {
      io.to(`${userId}`).emit("newNotification", userNotification);
    }

    return PickupRequestMapper.mapPickupReqDTO(updatedPickup);
  }
  async cancelPickupRequest(
    plantId: string,
    pickupReqId: string,
    reason: string,
  ) {
    const updatedPickupRequest =
      await this.pickupRepository.updatePickupRequest(pickupReqId);

    const io = globalThis.io;

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

    if (io) {
      io.to(`${userId}`).emit("newNotification", userNotification);
    }

    return PickupRequestMapper.mapPickupReqDTO(updatedPickupRequest);
  }
  async reschedulePickup(
    wasteplantId: string,
    pickupReqId: string,
    data: ReschedulePickupDTO,
  ) {
    const existingPickup =
      await this.pickupRepository.getPickupById(pickupReqId);

    if (!existingPickup) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.PICKUP_NOT_FOUND,
      );
    }
    if (existingPickup?.wasteplantId?.toString() !== wasteplantId.toString()) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        MESSAGES.SUPERADMIN.ERROR.NOT_IN_PLANT,
      );
    }
    const driver = await this.driverRepository.updateDriverAssignedZone(
      data.driverId,
      data.assignedZone,
    );

    if (!driver) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.NOT_FOUND,
      );
    }
    const truckId = driver?.assignedTruckId;
    if (!truckId) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_ID_MISS,
      );
    }
    const truck = await this.truckRepository.getTruckById(truckId.toString());

    const updatedPickup = await this.pickupRepository.updatePickupDate(
      pickupReqId,
      {
        driverId: data.driverId,
        rescheduledPickupDate: data.rescheduledPickupDate,
        pickupTime: data.pickupTime,
        status: data.status,
      },
    );

    if (!updatedPickup) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.PICKUP_FAILED,
      );
    }
    const plant =
      await this.wastePlantRepository.getWastePlantById(wasteplantId);

    if (!plant || String(plant._id) !== String(updatedPickup.wasteplantId)) {
      throw new Error(
        "Driver's plant does not match pickup's plant. Skipping notification.",
      );
    }
    const io = globalThis.io;

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

    if (io) {
      io.to(`${userId}`).emit("newNotification", userNotification);
    }
    return PickupRequestMapper.mapPickupReqDTO(updatedPickup);
  }
  async getAvailableDriverService(location: string, plantId: string) {
    const drivers = await this.driverRepository.getDriversByLocation(
      location,
      plantId,
    );
    return DriverMapper.mapDriversDTO(drivers);
  }
  async approveModifyPickup(wasteplantId: string, pickupReqId: string) {
    const pickup = await this.pickupRepository.getPickupById(pickupReqId);
    if (!pickup) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.PICKUP_NOT_FOUND,
      );
    }
    if (pickup.wasteplantId?.toString() !== wasteplantId) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        MESSAGES.SUPERADMIN.ERROR.NOT_IN_PLANT,
      );
    }
    if (pickup.requestType === "Pause") {
      pickup.isPaused = true;
    }
    if (pickup.requestType === "FrequencyChange") {
      if (!pickup.requestedFrequency) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.WASTEPLANT.ERROR.REQ_FREQ_MISS,
        );
      }
      pickup.frequency = pickup.requestedFrequency;
      pickup.pauseUntil = null;
    }

    const io = globalThis.io;

    const userMessage = `Your modification request for Pickup ${pickup.pickupId} has been approved.`;
    const userNotification =
      await this.notificationRepository.createNotification({
        receiverId: pickup.userId.toString(),
        receiverType: "user",
        senderId: wasteplantId,
        senderType: "wasteplant",
        message: userMessage,
        type: "pickup_modify-approve",
        pickupRequestId: pickup._id.toString(),
      });

    if (io) {
      io.to(`${pickup.userId.toString()}`).emit(
        "newNotification",
        userNotification,
      );
    }

    pickup.requestType = null;
    pickup.requestedFrequency = null;

    await pickup.save();

    return true;
  }

  async rejectModifyPickup(wasteplantId: string, pickupReqId: string) {
    const pickup = await this.pickupRepository.getPickupById(pickupReqId);
    if (!pickup) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }
    if (pickup.wasteplantId?.toString() !== wasteplantId) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        MESSAGES.SUPERADMIN.ERROR.NOT_IN_PLANT,
      );
    }

    pickup.requestType = null;
    pickup.requestedFrequency = null;
    pickup.pauseUntil = null;

    await pickup.save();

    const io = globalThis.io;

    const userMessage = `Your modification request for Pickup ${pickup.pickupId} has been rejected.`;
    const userNotification =
      await this.notificationRepository.createNotification({
        receiverId: pickup.userId.toString(),
        receiverType: "user",
        senderId: wasteplantId,
        senderType: "wasteplant",
        message: userMessage,
        type: "pickup_modify-reject",
        pickupRequestId: pickup._id.toString(),
      });

    if (io) {
      io.to(`${pickup.userId.toString()}`).emit(
        "newNotification",
        userNotification,
      );
    }
    return true;
  }
}

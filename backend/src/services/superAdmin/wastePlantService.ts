import bcrypt from "bcrypt";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantService } from "./interface/IWastePlantService";
import { checkForDuplicateWastePlant } from "../../utils/wastePlantDuplicateValidator";
import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { PaginationInput } from "../../dtos/common/commonDTO";
import {
  PaginatedReturnAdminWastePlants,
  ReturnAdminWastePlant,
  ReturnDeleteWP,
  WasteplantDTO,
} from "../../dtos/wasteplant/WasteplantDTO";
import { WastePlantMapper } from "../../mappers/WastePlantMapper";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { notificationPayload } from "../../dtos/notification/notificationDTO";

@injectable()
export class WastePlantService implements IWastePlantService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.NotificationRepository)
    private _notificationRepository: INotificationRepository,
    @inject(TYPES.SubscriptionPaymentRepository)
    private _subscriptionPaymentRepository: ISubscriptionPaymentRepository,
    @inject(TYPES.PickupRepository)
    private _pickupReqRepository: IPickupRepository
  ) {}
  async addWastePlant(data: IWastePlant) {
    await checkForDuplicateWastePlant(
      {
        email: data.email,
        licenseNumber: data.licenseNumber,
        plantName: data.plantName,
      },
      this._wastePlantRepository
    );
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const now = new Date();

    const newData: IWastePlant = {
      ...data,
      password: hashedPassword,
      autoSubscribeAt: new Date(now.getTime() + 5 * 60 * 1000),
      subscribeNotificationSent: false,
    };
    const plant = await this._wastePlantRepository.createWastePlant(
      newData
    );
    if (!plant) {
      throw new Error("Failed to create waste plant");
    }

    return true;
  }

  async getAllWastePlants(
    data: PaginationInput
  ): Promise<PaginatedReturnAdminWastePlants> {
    const plantData = await this._wastePlantRepository.getAllWastePlants(data);
    if (!plantData) {
      throw new Error("Wasteplants not found.");
    }
    const paidPayments =
      await this._subscriptionPaymentRepository.findPaidSubscriptionPayments();
    if (!paidPayments) {
      throw new Error("Paid subscription plans not found.");
    }
    const now = new Date();

    const latestPaymentsMap = new Map();

    for (const payment of paidPayments) {
      const existing = latestPaymentsMap.get(payment.wasteplantId?.toString());

      if (
        payment?.expiredAt &&
        (!existing ||
          (existing.expiredAt &&
            new Date(payment.expiredAt) > new Date(existing.expiredAt)))
      ) {
        latestPaymentsMap.set(payment.wasteplantId?.toString(), payment);
      }
    }

    // Add latestSubscription info to each plant
    const updatedPlants: ReturnAdminWastePlant[] = [];

    for (const plant of plantData.wasteplants) {
      const plantIdStr = plant._id.toString();
      const latestPayment = latestPaymentsMap.get(plantIdStr);
      const dto = WastePlantMapper.mapWastePlantDTO(plant);
      if (latestPayment) {
        const expiredAt = new Date(latestPayment.expiredAt);
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const startOfExpiry = new Date(
          expiredAt.getFullYear(),
          expiredAt.getMonth(),
          expiredAt.getDate()
        );

        const daysLeft = Math.max(
          0,
          Math.floor(
            (startOfExpiry.getTime() - startOfToday.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );

        if (daysLeft === 0 && plant.status !== "Inactive") {
          await this._wastePlantRepository.updatePlantStatus(
            plantIdStr,
            "Inactive"
          );
          plant.status = "Inactive";
          dto.status = "Inactive";
        }

        updatedPlants.push({
          plantData: dto,
          latestSubscription: {
            subPaymentStatus: latestPayment.status,
            expiredAt,
            daysLeft,
          },
        });
      } else {
        updatedPlants.push({
          plantData: dto,
          latestSubscription: null,
        });
      }
    }

    return {
      total: plantData.total,
      wasteplants: updatedPlants,
    };
  }
  async getWastePlantByIdService(id: string): Promise<WasteplantDTO> {
      const plant =  await this._wastePlantRepository.getWastePlantById(id);
      if(!plant){
        throw new Error("Plant not found.")
      }
      return WastePlantMapper.mapWastePlantDTO(plant);
  }
  async updateWastePlantByIdService(
    id: string,
    data: IWastePlant
  ): Promise<boolean> {
      const updated =  await this._wastePlantRepository.updateWastePlantById(id, data);
      return !!updated;
  }
  async deleteWastePlantByIdService(id: string): Promise<ReturnDeleteWP> {
    const plant = await this._wastePlantRepository.deleteWastePlantById(id);
    if (!plant) {
      throw new Error("Plant not found.");
    }
    return { plantId: plant._id.toString() };
  }
  // async sendSubscribeNotification(data: notificationPayload) {
  //   const plant = await this._wastePlantRepository.getWastePlantById(
  //     data.plantId
  //   );
  //   if (!plant) {
  //     throw new Error("Plant not found.");
  //   }
  //   if (plant.createdAt) {
  //     const createdAt = new Date(plant.createdAt);
  //     const now = new Date();
  //     const hoursPassed =
  //       (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  //     if (hoursPassed < 24) {
  //       throw new Error(
  //         "Subscription reminder can only be sent after 24 hours of creation."
  //       );
  //     }
  //   }

  //   const message = `Reminder: Your plant subscription is pending. Please subscribe to activate features.`;

  //   const plantNotification =
  //     await this._notificationRepository.createNotification({
  //       receiverId: data.plantId,
  //       receiverType: "wasteplant",
  //       senderId: data.adminId,
  //       senderType: "superadmin",
  //       message,
  //       type: "subscribe_reminder",
  //     });
  //   console.log("notification", plantNotification);

  //   const io = global.io;

  //   if (io) {
  //     io.to(`${plant._id}`).emit("newNotification", plantNotification);
  //   }
  // }
  async plantBlockStatus(plantId: string, isBlocked: boolean): Promise<WasteplantDTO> {
    const wasteplant = await this._wastePlantRepository.getWastePlantById(
      plantId
    );
    if (!wasteplant) {
      throw new Error("Plant not found.");
    }
    wasteplant.isBlocked = isBlocked;
    const pickupReqsts = await this._pickupReqRepository.getAllPickupsByStatus(
      plantId
    );
    console.log("pickupReqsts", pickupReqsts);

    const distinctUserIds = [
      ...new Set(pickupReqsts.map((p) => p.userId?.toString()).filter(Boolean)),
    ];
    console.log("distinctUserIds", distinctUserIds);
    const io = global.io;
    if (isBlocked) {
      wasteplant.blockedAt = new Date();
      // wasteplant.autoUnblockAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      wasteplant.autoUnblockAt = new Date(Date.now() + 5 * 60 * 1000);
      wasteplant.unblockNotificationSent = false;
      for (const userId of distinctUserIds) {
        const message = `Your scheduled pickup with ${wasteplant.plantName} is temporarily unavailable due to a short maintenance break.  
Our team is working on it, and services will be back within 24 hours.  
Thank you for your understanding.`;

        const userNotification =
          await this._notificationRepository.createNotification({
            receiverId: userId,
            receiverType: "user",
            senderId: plantId,
            senderType: "wasteplant",
            message,
            type: "general",
          });

        if (io) {
          io.to(`${userId}`).emit("newNotification", userNotification);
        }

        console.log("Sent notification to user:", userId);
      }
    } else {
      wasteplant.blockedAt = null;
      wasteplant.autoUnblockAt = null;
      wasteplant.unblockNotificationSent = true;
      for (const userId of distinctUserIds) {
        const message = `Your scheduled pickup with ${wasteplant.plantName} is now available again.  
Thank you for your patience.`;

        const userNotification =
          await this._notificationRepository.createNotification({
            receiverId: userId,
            receiverType: "user",
            senderId: plantId,
            senderType: "wasteplant",
            message,
            type: "general",
          });

        if (io) {
          io.to(`${userId}`).emit("newNotification", userNotification);
        }

        console.log("Sent notification to user:", userId);
      }
    }
    await wasteplant.save({ validateModifiedOnly: true });
    return WastePlantMapper.mapWastePlantDTO(wasteplant);
  }
}

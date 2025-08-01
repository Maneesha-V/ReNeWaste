import bcrypt from "bcrypt";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantService } from "./interface/IWastePlantService";
import { checkForDuplicateWastePlant } from "../../utils/wastePlantDuplicateValidator";
import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import {
  notificationPayload,
  ReturnDeleteWP,
} from "../../types/superAdmin/wastePlantTypes";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { PaginationInput } from "../../dtos/common/commonDTO";
import {
  PaginatedReturnAdminWastePlants,
  ReturnAdminWastePlant,
} from "../../dtos/wasteplant/WasteplantDTO";
import { WastePlantMapper } from "../../mappers/WastePlantMapper";

@injectable()
export class WastePlantService implements IWastePlantService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
    @inject(TYPES.SubscriptionPaymentRepository)
    private subscriptionPaymentRepository: ISubscriptionPaymentRepository
  ) {}
  async addWastePlant(data: IWastePlant) {
    await checkForDuplicateWastePlant(
      {
        email: data.email,
        licenseNumber: data.licenseNumber,
        plantName: data.plantName,
      },
      this.wastePlantRepository
    );
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newData: IWastePlant = {
      ...data,
      password: hashedPassword,
    };
    const createdPlant = await this.wastePlantRepository.createWastePlant(
      newData
    );
    if (!createdPlant) {
      throw new Error("Failed to create waste plant");
    }
    return {
      success: true,
    };
  }

  // async getAllWastePlants(): Promise<IWastePlant[]> {
  //   const updatedData = return await this.wastePlantRepository.getAllWastePlants();
  //   return plantData;
  // }
  async getAllWastePlants(
    data: PaginationInput
  ): Promise<PaginatedReturnAdminWastePlants> {
    const plantData = await this.wastePlantRepository.getAllWastePlants(data);
    if (!plantData) {
      throw new Error("Wasteplants not found.");
    }
    const paidPayments =
      await this.subscriptionPaymentRepository.findPaidSubscriptionPayments();
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
          await this.wastePlantRepository.updatePlantStatus(
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
  async getWastePlantByIdService(id: string): Promise<IWastePlant | null> {
    try {
      return await this.wastePlantRepository.getWastePlantById(id);
    } catch (error) {
      throw new Error("Error fetching waste plant from service");
    }
  }
  async updateWastePlantByIdService(
    id: string,
    data: IWastePlant
  ): Promise<IWastePlant | null> {
    try {
      return await this.wastePlantRepository.updateWastePlantById(id, data);
    } catch (error) {
      throw new Error("Error updating waste plant in service");
    }
  }
  async deleteWastePlantByIdService(id: string): Promise<ReturnDeleteWP> {
    const plant = await this.wastePlantRepository.deleteWastePlantById(id);
    if (!plant) {
      throw new Error("Plant not found.");
    }
    return { plantId: plant._id.toString() };
  }
  async sendSubscribeNotification(data: notificationPayload) {
    const plant = await this.wastePlantRepository.getWastePlantById(
      data.plantId
    );
    if (!plant) {
      throw new Error("Plant not found.");
    }
    if (plant.createdAt) {
      const createdAt = new Date(plant.createdAt);
      const now = new Date();
      const hoursPassed =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        throw new Error(
          "Subscription reminder can only be sent after 24 hours of creation."
        );
      }
    }

    const message = `Reminder: Your plant subscription is pending. Please subscribe to activate features.`;

    const plantNotification =
      await this.notificationRepository.createNotification({
        receiverId: data.plantId,
        receiverType: "wasteplant",
        senderId: data.adminId,
        senderType: "superadmin",
        message,
        type: "subscribe_reminder",
      });
    console.log("notification", plantNotification);

    const io = global.io;

    if (io) {
      io.to(`${plant._id}`).emit("newNotification", plantNotification);
    }
  }
}

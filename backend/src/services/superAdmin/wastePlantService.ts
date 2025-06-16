import bcrypt from "bcrypt";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantService } from "./interface/IWastePlantService";
import { checkForDuplicateWastePlant } from "../../utils/wastePlantDuplicateValidator";
import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import {
  notificationPayload,
  ReturnAdminWastePlant,
} from "../../types/superAdmin/wastePlantTypes";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";

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
  async addWastePlant(data: IWastePlant): Promise<IWastePlant> {
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
    return await this.wastePlantRepository.createWastePlant(newData);
  }

  // async getAllWastePlants(): Promise<IWastePlant[]> {
  //   const updatedData = return await this.wastePlantRepository.getAllWastePlants();
  //   return plantData;
  // }
  async getAllWastePlants(): Promise<ReturnAdminWastePlant[]> {
    const plantData = await this.wastePlantRepository.getAllWastePlants();
    const paidPayments =
      await this.subscriptionPaymentRepository.findPaidSubscriptionPayments();
    if (!paidPayments) {
      throw new Error("Paid subscription plans not found.");
    }
    if (!plantData) {
      throw new Error("Wasteplants not found.");
    }
    const now = new Date();

    // Create a map of latest payment per plantId
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
    const updatedPlants = plantData.map((plant: any) => {
      const plantIdStr = plant._id.toString();
      const latestPayment = latestPaymentsMap.get(plantIdStr);

      if (latestPayment) {
        const expiredAt = new Date(latestPayment.expiredAt);
        const daysLeft = Math.ceil(
          (expiredAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          plantData: plant,
          latestSubscription: {
            status: latestPayment.status,
            expiredAt,
            daysLeft,
          },
        };
      } else {
        return {
          plantData: plant,
          latestSubscription: null,
        };
      }
    });

    return updatedPlants;
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
    data: any
  ): Promise<IWastePlant | null> {
    try {
      return await this.wastePlantRepository.updateWastePlantById(id, data);
    } catch (error) {
      throw new Error("Error updating waste plant in service");
    }
  }
  async deleteWastePlantByIdService(id: string) {
    return await this.wastePlantRepository.deleteWastePlantById(id);
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

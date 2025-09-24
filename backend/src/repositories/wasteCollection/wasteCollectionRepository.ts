import { inject, injectable } from "inversify";
import { IWasteCollectionDocument } from "../../models/wasteCollection/interfaces/wasteCollectionInterface";
import { WasteCollectionModel } from "../../models/wasteCollection/wasteCollectionModel";
import BaseRepository from "../baseRepository/baseRepository";
import { IWasteCollectionRepository } from "./interface/IWasteCollectionRepository";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../driver/interface/IDriverRepository";
import { ITruckRepository } from "../truck/interface/ITruckRepository";
import { INotificationRepository } from "../notification/interface/INotifcationRepository";
import mongoose from "mongoose";
import { FilterReport } from "../../dtos/wasteplant/WasteplantDTO";
import {
  InputWasteMeasurement,
  ReturnTotalWasteAmount,
  ReturnWasteMeasurement,
} from "../../dtos/wasteCollection/wasteCollectionDTO";

@injectable()
export class WasteCollectionRepository
  extends BaseRepository<IWasteCollectionDocument>
  implements IWasteCollectionRepository
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {
    super(WasteCollectionModel);
  }

  async createWasteMeasurement(
    data: InputWasteMeasurement,
  ): Promise<ReturnWasteMeasurement> {
    const notification = await this.notificationRepository.getNotificationById(
      data.notificationId,
    );
    if (!notification) {
      throw new Error("Notification not found.");
    }
    if (notification.receiverId.toString() !== data.wasteplantId) {
      throw new Error("Wasteplant mismatch.");
    }
    const messageParts = notification?.message.split(" ");
    const vehicleNumber = messageParts[1];
    const driverName = messageParts[messageParts.length - 1];

    const driver = await this.driverRepository.findDriverByName(driverName);
    const truck = await this.truckRepository.findTruckByVehicle(vehicleNumber);
    if (!driver || !truck) {
      throw new Error("Driver or Truck not found.");
    }
    console.log({ driver, truck });
    const collectedWeight = data.weight - truck.tareWeight;
    const wasteType = driver.category;

    await this.model.create({
      driverId: driver._id,
      truckId: truck._id,
      wasteplantId: data.wasteplantId,
      measuredWeight: data.weight,
      collectedWeight: collectedWeight,
      wasteType: wasteType,
      returnedAt: notification.createdAt,
    });
    return { notificationId: notification._id.toString() };
  }
  async totalWasteAmount(plantId: string): Promise<ReturnTotalWasteAmount> {
    const wasteData = await this.model.aggregate([
      {
        $match: {
          wasteplantId: new mongoose.Types.ObjectId(plantId),
        },
      },
      {
        $group: {
          _id: "$wasteType",
          totalCollectedWeight: { $sum: "$collectedWeight" },
        },
      },
    ]);
    let totalResidWaste = 0;
    let totalCommWaste = 0;
    for (const item of wasteData) {
      if (item._id === "Residential") {
        totalResidWaste = item.totalCollectedWeight;
      } else if (item._id === "Commercial") {
        totalCommWaste = item.totalCollectedWeight;
      }
    }
    return {
      totalResidWaste,
      totalCommWaste,
    };
  }
  async fetchWasteCollectionReportsByPlantId(plantId: string) {
    const collectionReports = await this.model
      .find({
        wasteplantId: plantId,
      })
      .populate({
        path: "driverId",
        select: "name",
      })
      .populate({
        path: "truckId",
        select: "name",
      });
    return collectionReports;
  }
  async filterWasteCollectionReportsByPlantId(data: FilterReport) {
    const fromDate = new Date(`${data.from}T00:00:00.000Z`);
    const toDate = new Date(`${data.to}T23:59:59.999Z`);

    const filterReports = await this.model
      .find({
        wasteplantId: data.plantId,
        createdAt: { $gte: fromDate, $lte: toDate },
      })
      .populate({
        path: "driverId",
        select: "name",
      })
      .populate({
        path: "truckId",
        select: "name",
      });
    return filterReports;
  }
  async getTotalWasteCollected(): Promise<number> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$collectedWeight" },
        },
      },
    ]);
    return result[0]?.total || 0;
  }
}

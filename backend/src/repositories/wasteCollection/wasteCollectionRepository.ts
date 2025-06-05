import { inject, injectable } from "inversify";
import { IWasteCollectionDocument } from "../../models/wasteCollection/interfaces/wasteCollectionInterface";
import { WasteCollectionModel } from "../../models/wasteCollection/wasteCollectionModel";
import BaseRepository from "../baseRepository/baseRepository";
import { IWasteCollectionRepository } from "./interface/IWasteCollectionRepository";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../driver/interface/IDriverRepository";
import { InputWasteMeasurement, ReturnWasteMeasurement } from "../../types/wastePlant/notificationTypes";
import { ITruckRepository } from "../truck/interface/ITruckRepository";
import { INotificationRepository } from "../notification/interface/INotifcationRepository";

@injectable()
export class WasteCollectionRepository extends BaseRepository<IWasteCollectionDocument> implements IWasteCollectionRepository {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,  
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,  
  ){
    super(WasteCollectionModel)
  }
  
  async createWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement> {

  const notification = await this.notificationRepository.getNotificationById(data.notificationId);
    if (!notification) {
    throw new Error("Notification not found.");
  }
  if(notification.receiverId.toString() !== data.wasteplantId){
    throw new Error("Wasteplant mismatch.")
  }
  const messageParts = notification?.message.split(" ");
  const vehicleNumber = messageParts[1];
  const driverName  = messageParts[messageParts.length - 1];

  const driver = await this.driverRepository.findDriverByName(driverName);
  const truck = await this.truckRepository.findTruckByVehicle(vehicleNumber);
  if (!driver || !truck) {
    throw new Error("Driver or Truck not found.");
  }
  console.log({driver,truck});
  const collectedWeight = truck.capacity - data.weight; 
  const wasteType = driver.category; 
 
  await this.model.create({
    driverId: driver._id,
    truckId: truck._id,
    wasteplantId: data.wasteplantId,
    measuredWeight: data.weight,
    collectedWeight: collectedWeight,
    wasteType: wasteType,
    returnedAt: notification.createdAt
  });
  return { notificationId: notification._id.toString() };

}

}
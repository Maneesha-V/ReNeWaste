import { IWastePlant } from "../../../models/wastePlant/interfaces/wastePlantInterface";
import { notificationPayload, ReturnAdminWastePlant } from "../../../types/superAdmin/wastePlantTypes";

export interface IWastePlantService {
    addWastePlant(data: IWastePlant): Promise<IWastePlant>;
    getAllWastePlants(): Promise<ReturnAdminWastePlant[]>;
    getWastePlantByIdService(id: string): Promise<IWastePlant | null>;
    updateWastePlantByIdService(id: string,data: any): Promise<IWastePlant | null>;
    deleteWastePlantByIdService(id: string): Promise<IWastePlant | null>;
    sendSubscribeNotification(data: notificationPayload): Promise<any>;
  }
import { PaginationInput } from "../../../dtos/common/commonDTO";
import { notificationPayload } from "../../../dtos/notification/notificationDTO";
import { PaginatedReturnAdminWastePlants, ReturnDeleteWP, WasteplantDTO } from "../../../dtos/wasteplant/WasteplantDTO";
import { IWastePlant } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IWastePlantService {
    addWastePlant(data: IWastePlant): Promise<boolean>;
    getAllWastePlants(data: PaginationInput): Promise<PaginatedReturnAdminWastePlants>;
    getWastePlantByIdService(id: string): Promise<WasteplantDTO>;
    updateWastePlantByIdService(id: string,data: IWastePlant): Promise<boolean>;
    deleteWastePlantByIdService(id: string): Promise<ReturnDeleteWP>;
    // sendSubscribeNotification(data: notificationPayload): Promise<any>;
    plantBlockStatus(plantId: string, isBlocked: boolean): Promise<WasteplantDTO>;
  }
import { PaginationInput } from "../../../dtos/common/commonDTO";
import { AddWastePlantResult, PaginatedReturnAdminWastePlants, ReturnAdminWastePlant, WasteplantDTO } from "../../../dtos/wasteplant/WasteplantDTO";
import { IWastePlant } from "../../../models/wastePlant/interfaces/wastePlantInterface";
import { notificationPayload, ReturnDeleteWP } from "../../../types/superAdmin/wastePlantTypes";

export interface IWastePlantService {
    addWastePlant(data: IWastePlant): Promise<AddWastePlantResult>;
    getAllWastePlants(data: PaginationInput): Promise<PaginatedReturnAdminWastePlants>;
    getWastePlantByIdService(id: string): Promise<IWastePlant | null>;
    updateWastePlantByIdService(id: string,data: IWastePlant): Promise<IWastePlant | null>;
    deleteWastePlantByIdService(id: string): Promise<ReturnDeleteWP>;
    sendSubscribeNotification(data: notificationPayload): Promise<any>;
    plantBlockStatus(plantId: string, isBlocked: boolean): Promise<WasteplantDTO>;
  }
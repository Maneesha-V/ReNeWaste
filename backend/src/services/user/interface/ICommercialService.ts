import { UpdatedCommercialDataDTO, UserDTO } from "../../../dtos/user/userDTO";

export interface ICommercialService {
  getCommercialService(userId: string): Promise<UserDTO>;
  availableWasteService(
    service: string,
    wasteplantId: string,
  ): Promise<boolean>;
  updateCommercialPickupService(
    userId: string,
    updatedData: UpdatedCommercialDataDTO,
  ): Promise<boolean>;
}

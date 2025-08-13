import { UpdatedResidentialData, UserDTO } from "../../../dtos/user/userDTO";

export interface IResidentialService {
    getResidentialService(userId: string): Promise<UserDTO>;
    updateResidentialPickupService(userId: string, updatedData: UpdatedResidentialData): Promise<boolean>;
}
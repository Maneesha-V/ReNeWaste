import { UpdatedResidentialData } from "../../../dtos/user/userDTO";

export interface IResidentialService {
    getResidentialService(userId: string): Promise<any>;
    updateResidentialPickupService(userId: string, updatedData: UpdatedResidentialData): Promise<void>;
}
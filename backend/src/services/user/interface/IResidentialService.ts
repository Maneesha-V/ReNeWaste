export interface IResidentialService {
    getResidentialService(userId: string): Promise<any>;
    updateResidentialPickupService(userId: string, updatedData: any): Promise<any>;
}
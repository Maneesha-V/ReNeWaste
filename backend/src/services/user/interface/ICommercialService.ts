export interface ICommercialService {
    getCommercialService(userId: string): Promise<any>;
    availableWasteService(service: string, wasteplantId: string):Promise<boolean>
    updateCommercialPickupService(userId: string, updatedData: any): Promise<any>;
}
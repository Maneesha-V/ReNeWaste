import { IDriverDocument } from '../../../models/driver/interfaces/driverInterface';

export interface IProfileService {
    getDriverProfile(userId: string): Promise<any>;
    updateDriverProfile(driverId: string, updatedData: any): Promise<any>;
    fetchDriversService(wastePlantId: string): Promise<IDriverDocument[]>;
}
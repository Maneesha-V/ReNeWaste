export interface IProfileService {
    getDriverProfile(userId: string): Promise<any>;
    updateDriverProfile(driverId: string, updatedData: any): Promise<any>;
}
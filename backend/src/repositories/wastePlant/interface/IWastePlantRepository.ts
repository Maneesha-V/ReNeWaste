import { IWastePlant, IWastePlantDocument } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IWastePlantRepository {
    createWastePlant(data: IWastePlant): Promise<IWastePlantDocument>;
    findWastePlantByEmail(email: string): Promise<IWastePlant | null>;
    findWastePlantByLicense(licenseNumber: string): Promise<IWastePlant | null>;
    findWastePlantByName(plantName: string): Promise<IWastePlant | null>
    getAllWastePlants(): Promise<IWastePlant[]>;
    getWastePlantById(id: string): Promise<IWastePlant | null>;
}
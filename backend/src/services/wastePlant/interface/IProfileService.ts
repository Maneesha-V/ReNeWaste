import { IWastePlant, IWastePlantDocument } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IProfileService {
    getPlantProfile(plantId: string): Promise<IWastePlantDocument>;
    updatePlantProfile(plantId: string, updatedData: IWastePlant): Promise<IWastePlant | null>;
}
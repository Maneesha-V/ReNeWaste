import { WasteplantDTO } from "../../../dtos/wasteplant/WasteplantDTO";
import { IWastePlant } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IProfileService {
    getPlantProfile(plantId: string): Promise<WasteplantDTO>;
    updatePlantProfile(plantId: string, updatedData: IWastePlant): Promise<WasteplantDTO>;
}
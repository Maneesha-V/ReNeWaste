import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
  ){}
  async getPlantProfile(plantId: string) {
    const wasteplant = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!wasteplant) throw new Error("Wasteplant not found");
    return wasteplant;
  }
  async updatePlantProfile(plantId: string, updatedData: IWastePlant ) {
    const wasteplant = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!wasteplant) throw new Error("Plant not found");

    return await this.wastePlantRepository.updateWastePlantById(plantId, updatedData);
  }
//   async fetchDriversService(wastePlantId: string) {
//     return await this.driverRepository.fetchDriversByPlantId(wastePlantId);
//   }
}

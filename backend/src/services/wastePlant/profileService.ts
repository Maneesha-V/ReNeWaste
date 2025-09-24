import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { WastePlantMapper } from "../../mappers/WastePlantMapper";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
  ) {}
  async getPlantProfile(plantId: string) {
    const wasteplant =
      await this.wastePlantRepository.getWastePlantById(plantId);
    if (!wasteplant) throw new Error("Wasteplant not found");
    return WastePlantMapper.mapWastePlantDTO(wasteplant);
  }
  async updatePlantProfile(plantId: string, updatedData: IWastePlant) {
    const wasteplant =
      await this.wastePlantRepository.getWastePlantById(plantId);
    if (!wasteplant) throw new Error("Plant not found");

    const updated = await this.wastePlantRepository.updateWastePlantById(
      plantId,
      updatedData,
    );
    if (!updated) {
      throw new Error("Plant can't update.");
    }
    return WastePlantMapper.mapWastePlantDTO(updated);
  }
}

import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { WastePlantMapper } from "../../mappers/WastePlantMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
  ) {}
  async getPlantProfile(plantId: string) {
    const wasteplant =
      await this.wastePlantRepository.getWastePlantById(plantId);
    if (!wasteplant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }
    return WastePlantMapper.mapWastePlantDTO(wasteplant);
  }
  async updatePlantProfile(plantId: string, updatedData: IWastePlant) {
    const wasteplant =
      await this.wastePlantRepository.getWastePlantById(plantId);
    if (!wasteplant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }

    const updated = await this.wastePlantRepository.updateWastePlantById(
      plantId,
      updatedData,
    );
    if (!updated) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.PICKUP_FAILED,
      );
    }
    return WastePlantMapper.mapWastePlantDTO(updated);
  }
}

import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IReportService } from "./interface/IReportService";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { FilterReport } from "../../dtos/wasteplant/WasteplantDTO";
import { WasteCollectionMapper } from "../../mappers/WasteCollectionMapper";
import { PopulatedWasteCollectionDTO } from "../../dtos/wasteCollection/wasteCollectionDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject(TYPES.WasteCollectionRepository)
    private wasteCollectionRepository: IWasteCollectionRepository,
  ) {}
  async getWasteReports(
    plantId: string,
  ): Promise<PopulatedWasteCollectionDTO[]> {
    const wastereports =
      await this.wasteCollectionRepository.fetchWasteCollectionReportsByPlantId(
        plantId,
      );
    if (!wastereports) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.WASTE_REP_NOT_FOUND,
      );
    }
    return WasteCollectionMapper.mapPopulatedWasteCollectionsDTO(wastereports);
  }
  async filterWasteReports(data: FilterReport) {
    const wastereports =
      await this.wasteCollectionRepository.filterWasteCollectionReportsByPlantId(
        data,
      );
    if (!wastereports) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.WASTE_REP_NOT_FOUND,
      );
    }

    return WasteCollectionMapper.mapPopulatedWasteCollectionsDTO(wastereports);
  }
}

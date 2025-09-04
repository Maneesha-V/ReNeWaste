import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IReportService } from "./interface/IReportService";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { FilterReport } from "../../dtos/wasteplant/WasteplantDTO";
import { WasteCollectionMapper } from "../../mappers/WasteCollectionMapper";

@injectable()
export class ReportService implements IReportService {
  constructor(
    // @inject(TYPES.WastePlantRepository)
    // private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.WasteCollectionRepository)
    private wasteCollectionRepository: IWasteCollectionRepository
  ) {}
  async getWasteReports(plantId: string) {
    const wastereports = await this.wasteCollectionRepository.fetchWasteCollectionReportsByPlantId(plantId);
    if(!wastereports){
      throw new Error("Waste report not found.")
    }
    return WasteCollectionMapper.mapWasteCollectionsDTO(wastereports);
  }
  async filterWasteReports(data: FilterReport){
    const { plantId, from, to } = data;
    const wastereports =  await this.wasteCollectionRepository.filterWasteCollectionReportsByPlantId(data);
    if(!wastereports){
      throw new Error("Waste report not found.")
    }
    return WasteCollectionMapper.mapWasteCollectionsDTO(wastereports);
  }
}
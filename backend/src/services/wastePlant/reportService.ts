import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IReportService } from "./interface/IReportService";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { FilterReport } from "../../dtos/wasteplant/WasteplantDTO";

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
    // const plantPickups = await this.pickupRepository.fetchWasteReportsByPlantId(plantId);
    // return plantPickups;
    return await this.wasteCollectionRepository.fetchWasteCollectionReportsByPlantId(plantId);
  }
  async filterWasteReports(data: FilterReport){
    const { plantId, from, to } = data;
    // const plantPickups = await this.pickupRepository.filterWasteReportsByPlantId(data);
    // return plantPickups;
    return await this.wasteCollectionRepository.filterWasteCollectionReportsByPlantId(data);
  }
}
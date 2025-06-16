import { IDashboardService } from "./interface/IDashboardService";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
  ) {}
  // async fetchDashboardData(): Promise<IWastePlant[]> {
  //   return await this.wastePlantRepository.getAllWastePlants();
  // }
}

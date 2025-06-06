import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardService } from "./interface/IDashboardService";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    // @inject(TYPES.WastePlantRepository)
    // private wastePlantRepository: IWastePlantRepository
  ) {}
}
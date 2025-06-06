import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardController } from "./interface/IDashboardController";
import { IDashboardService } from "../../services/wastePlant/interface/IDashboardService";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.PlantDashboardService)
    private dashboardService: IDashboardService
  ){}
}
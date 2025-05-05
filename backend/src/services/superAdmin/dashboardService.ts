import { IDashboardService } from "./interface/IDashboardService";
import WastePlantRepository from "../../repositories/wastePlant/wastePlantRepository";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";

class DashboardService implements IDashboardService {
    async fetchDashboardData(): Promise<IWastePlant[]> {
        return await WastePlantRepository.getAllWastePlants();

    }
}
export default new DashboardService();
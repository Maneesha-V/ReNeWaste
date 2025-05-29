import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardService } from "./interface/IDashboardService";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { WastePlantDashboardStats } from "../../types/wastePlant/dashboardTpes";

@injectable()
export class DashboardService implements IDashboardService{
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
  ) {}
  async fetchWastePlantDashboard(plantId: string): Promise<WastePlantDashboardStats> {
    const totalDrivers = await this.driverRepository.countAll();
    const totalTrucks = await this.truckRepository.countAll();
    const activePickups = await this.pickupRepository.countByStatus("Scheduled");
    const totalRevenue = await this.pickupRepository.calculateTotalRevenueByWastePlant(plantId);
      return {
    totalDrivers,
    totalTrucks,
    activePickups,
    totalRevenue
  };
  }
}
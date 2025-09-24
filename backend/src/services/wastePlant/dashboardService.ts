import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardService } from "./interface/IDashboardService";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.WasteCollectionRepository)
    private wasteCollectionRepository: IWasteCollectionRepository,
  ) {}

  async getDashboardData(plantId: string) {
    // const drivers = this.driverRepository.fetchAllDriversByPlantId(plantId);
    // const trucks = this.truckRepository.fetchAllTrucksByPlantId(plantId);
    // const totalPickups = this.pickupRepository.fetchAllPickupsByPlantId(plantId);
    // const totalWaste = this.wasteCollectionRepository.totalWasteAmount(plantId);
    // drivers, trucks, pickups, revenue, waste
    const [revenue, drivers, trucks, pickupStatus, totalWaste] =
      await Promise.all([
        this.pickupRepository.totalRevenueByPlantId(plantId),
        this.driverRepository.fetchAllDriversByPlantId(plantId),
        this.truckRepository.fetchAllTrucksByPlantId(plantId),
        this.pickupRepository.fetchAllPickupsByPlantId(plantId),
        this.wasteCollectionRepository.totalWasteAmount(plantId),
      ]);

    const totalActivePickups =
      pickupStatus.Residential.Active + pickupStatus.Commercial.Active;
    const totalCompletedPickups =
      pickupStatus.Residential.Completed + pickupStatus.Commercial.Completed;

    return {
      summary: {
        totalDrivers: drivers,
        totalTrucks: trucks,
        totalActivePickups,
        totalCompletedPickups,
        totalWasteCollected: totalWaste,
        totalRevenue: revenue.totalRevenue,
      },
      pickupStatus,
      drivers,
      trucks,
      revenue,
    };
  }
}

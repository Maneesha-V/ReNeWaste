import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardService } from "./interface/IDashboardService";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { FetchWPDashboard } from "../../dtos/wasteplant/WasteplantDTO";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { DashboardDataResp } from "../../dtos/common/commonDTO";

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
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository
  ) {}

  async getDashboardData(data: FetchWPDashboard): Promise<DashboardDataResp> {
    const { plantId } = data;
    // const drivers = this.driverRepository.fetchAllDriversByPlantId(plantId);
    // const trucks = this.truckRepository.fetchAllTrucksByPlantId(plantId);
    // const totalPickups = this.pickupRepository.fetchAllPickupsByPlantId(plantId);
    // const totalWaste = this.wasteCollectionRepository.totalWasteAmount(plantId);
    // drivers, trucks, pickups, revenue, waste
    const [drivers, trucks, pickupStatus, totalWaste] =
      await Promise.all([
        // this.pickupRepository.totalRevenueByPlantId(plantId),
        this.driverRepository.fetchAllDriversByPlantId(plantId),
        this.truckRepository.fetchAllTrucksByPlantId(plantId),
        this.pickupRepository.fetchAllPickupsByPlantId(plantId),
        this.wasteCollectionRepository.totalWasteAmount(plantId),
      ]);

    const totalActivePickups =
      pickupStatus.Residential.Active + pickupStatus.Commercial.Active;
    const totalCompletedPickups =
      pickupStatus.Residential.Completed + pickupStatus.Commercial.Completed;
    const pickupTrends = await this.pickupRepository.fetchAllCompletedPickups(data); 
    console.log("pickupTrends",pickupTrends);
    const { revenueTrends, wasteplantTotRevenue } = await this._walletRepository.fetchFilteredWPRevenue(data);
    console.log("revenueTrends",revenueTrends);
    return {
      summary: {
        totalDrivers: drivers,
        totalTrucks: trucks,
        totalActivePickups,
        totalCompletedPickups,
        totalWasteCollected: totalWaste,
        totalRevenue: wasteplantTotRevenue,
      },
      pickupStatus,
      drivers,
      trucks,
      pickupTrends,
      revenueTrends
    };
  }
}

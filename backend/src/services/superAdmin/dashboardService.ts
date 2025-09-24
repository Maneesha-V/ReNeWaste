import { IDashboardService } from "./interface/IDashboardService";
import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { SuperAdminDashboardData } from "../../dtos/superadmin/superadminDTO";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.SuperAdminRepository)
    private _superAdminRepository: ISuperAdminRepository,
    @inject(TYPES.TruckRepository)
    private _truckRepository: ITruckRepository,
    @inject(TYPES.DriverRepository)
    private _driverRepository: IDriverRepository,
    @inject(TYPES.WasteCollectionRepository)
    private _wasteCollectionRepository: IWasteCollectionRepository,
    @inject(TYPES.PickupRepository)
    private _pickupRepository: IPickupRepository,
  ) {}
  async fetchSuperAdminDashboard(
    adminId: string,
  ): Promise<SuperAdminDashboardData> {
    const admin = await this._superAdminRepository.getSuperAdminById(adminId);
    if (!admin) {
      throw new Error("Admin not found.");
    }

    const adminData = {
      name: admin.username,
    };

    const totalPlants = await this._wastePlantRepository.getTotalWastePlants();
    const totalTrucks = await this._truckRepository.getTotalTrucks();
    const totalDrivers = await this._driverRepository.getTotalDrivers();
    const totalWasteCollected =
      await this._wasteCollectionRepository.getTotalWasteCollected();
    const monthlyRevenue = await this._pickupRepository.totalRevenueByMonth();
    console.log({
      adminData,
      totalPlants,
      totalTrucks,
      totalDrivers,
      totalWasteCollected,
      monthlyRevenue,
    });
    return {
      adminData,
      totalPlants,
      totalTrucks,
      totalDrivers,
      totalWasteCollected,
      monthlyRevenue,
    };
  }
}

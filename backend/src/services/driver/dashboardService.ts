import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { IDashboardService } from "./interface/IDashboardService";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import {
  DriverDashboardResponse,
  DriverSupportInfo,
} from "../../dtos/driver/driverDTO";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IAttendanceRepository } from "../../repositories/atendance/interface/IAttendanceRepository";
import { AttendanceMapper } from "../../mappers/AttendanceMapper";
import { AttendanceDTO, DriverEarnRewardStatResp, FetchDriverEarnStats } from "../../dtos/attendance/attendanceDTO";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.DriverRepository)
    private _driverRepository: IDriverRepository,
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.AttendanceRepository)
    private _attendanceRepository: IAttendanceRepository,
  ) {}
  async fetchDriverDashboard(
    driverId: string,
  ): Promise<DriverDashboardResponse> {
    const driver = await this._driverRepository.getDriverById(driverId);
    if (!driver) {
      throw new Error("Driver not found.");
    }

    const driverData = {
      name: driver.name,
      email: driver.email,
    };

    let truckData = null;
    if (driver.assignedTruckId) {
      const truck = await this.truckRepository.getTruckById(
        driver.assignedTruckId.toString(),
      );
      if (truck) {
        truckData = {
          name: truck.name,
          vehicleNumber: truck.vehicleNumber,
          status: truck.status,
        };
      }
    }
    const { assignedCount, completedCount } =
      await this.pickupRepository.getDriverTotalPickups(driverId);

    const dashboardSummary = {
      driver: driverData,
      truck: truckData,
      pickupStats: {
        assignedTasks: assignedCount,
        completedTasks: completedCount,
      },
    };

    return { summary: dashboardSummary };
  }
  async fetchWastePlantSupport(driverId: string): Promise<DriverSupportInfo> {
    const driver = await this._driverRepository.getDriverById(driverId);
    let plantData = null;
    if (driver) {
      const wasteplant = await this.wastePlantRepository.getWastePlantById(
        driver.wasteplantId!.toString(),
      );
      if (wasteplant) {
        plantData = {
          plantName: wasteplant.plantName,
          ownerName: wasteplant.ownerName,
          location: wasteplant.location,
          district: wasteplant.district,
          taluk: wasteplant.taluk,
          pincode: wasteplant.pincode,
          state: wasteplant.state,
          contactInfo: wasteplant.contactInfo,
          contactNo: wasteplant.contactNo,
          email: wasteplant.email,
        };
      }
    }

    return { supportInfo: plantData };
  }
  async markAttendance(driverId: string, status: string): Promise<AttendanceDTO> {
    const driver = await this._driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");
      const attendance = await this._attendanceRepository.createAttendance({
        driverId, 
        status,
        wasteplantId: driver.wasteplantId?.toString()!,
        assignedTruckId: driver.assignedTruckId?.toString()!
      })
      return AttendanceMapper.mapAttendanceDTO(attendance);
  }
  async fetchDriverEarnStats( data: FetchDriverEarnStats): Promise<DriverEarnRewardStatResp[]>{
    const { driverId, filter } = data;
    const stats = await this._attendanceRepository.getDriverEarnRewardStats(data);
    // return stats;
    return [
  {
    "_id": { "day": "2025-11-25" },
    "totalReward": 300,
    "totalEarning": 600
  },
  {
    "_id": { "day": "2025-11-26" },
    "totalReward": 200,
    "totalEarning": 400
  }
]

  }
}

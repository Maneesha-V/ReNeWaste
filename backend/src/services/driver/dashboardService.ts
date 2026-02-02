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
import {
  AttendanceDTO,
  DriverEarnRewardStatResp,
  FetchDriverEarnStats,
} from "../../dtos/attendance/attendanceDTO";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(TYPES.DriverRepository)
    private _driverRepository: IDriverRepository,
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.PickupRepository)
    private _pickupRepository: IPickupRepository,
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
    console.log("-driver", driver);

    const driverData = {
      name: driver.name,
      email: driver.email,
      assignedZone: driver.assignedZone ?? "Not Assigned.",
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
      await this._pickupRepository.getDriverTotalPickups(driverId);

    const driverPickups =
      await this._pickupRepository.getDriverCompletedPickups(driverId);

    console.log("driveerPIckups", driverPickups);
    const recentActivities = driverPickups.map((p) => {
      const selectedAddress = p.userId.addresses.find(
        (ad) => ad._id.toString() === p.addressId.toString(),
      );
      if (!selectedAddress) {
        throw new Error(`Address not found for pickup ${p.pickupId}`);
      }

      return {
        pickupId: p.pickupId,
        status: p.status,
        completedAt: p.completedAt,
        selectedAddress,
      };
    });

    const driverAttendanceData =
      await this._attendanceRepository.findAttendancesByDriverId(driverId);

    //    if (!driverAttendanceData) {
    //   throw new Error("Driver attendances not found.");
    // }
    console.log("driverAttendanceData",driverAttendanceData);
    
    const dashboardSummary = {
      driver: driverData,
      truck: truckData,
      pickupStats: {
        assignedTasks: assignedCount,
        completedTasks: completedCount,
      },
      recentActivities,
      attendanceData: driverAttendanceData
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
  async markAttendance(
    driverId: string,
    status: string,
  ): Promise<AttendanceDTO> {
    const driver = await this._driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");
    const attendance = await this._attendanceRepository.createAttendance({
      driverId,
      status,
      wasteplantId: driver.wasteplantId?.toString()!,
      assignedTruckId: driver.assignedTruckId?.toString()!,
    });
    return AttendanceMapper.mapAttendanceDTO(attendance);
  }
  async fetchDriverEarnStats(
    data: FetchDriverEarnStats,
  ): Promise<DriverEarnRewardStatResp[]> {
    const { driverId, filter, from, to } = data;
    const stats =
      await this._attendanceRepository.getDriverEarnRewardStats(data);

    return stats;
  }
}

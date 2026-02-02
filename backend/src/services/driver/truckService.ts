import { ITruckService } from "./interface/ITruckService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import mongoose from "mongoose";
import { TruckMapper } from "../../mappers/TruckMapper";
import { DriverMapper } from "../../mappers/DriverMapper";
import { TruckAvailbleDTO } from "../../dtos/truck/truckDTO";
import { MarkReturnProps } from "../../dtos/driver/driverDTO";
import { IAttendanceRepository } from "../../repositories/atendance/interface/IAttendanceRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { stringify } from "querystring";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.AttendanceRepository)
    private _attendanceRepository: IAttendanceRepository,
    @inject(TYPES.PickupRepository)
    private _pickupRepository: IPickupRepository
  ) {}
  async getTruckForDriver(
    driverId: string,
    wasteplantId: string
  ): Promise<TruckAvailbleDTO[]> {
    const result = await this.truckRepository.getAssignedAvailableTrucks(
      driverId,
      wasteplantId
    );
    if (!result) {
      throw new Error("Can't found trucks.");
    }
    return TruckMapper.mapAvailableTrucksDTO(result);
  }
  async requestTruck(driverId: string) {
    const driver = await this.truckRepository.reqTruckToWastePlant(driverId);
    if (!driver) {
      throw new Error("Driver not found.");
    }
    return DriverMapper.mapDriverDTO(driver);
  }
  async markTruckReturnService({
    truckId,
    plantId,
    driverId,
  }: MarkReturnProps) {
    const { driver, truck } = await this.driverRepository.markTruckAsReturned(
      truckId,
      plantId,
      driverId
    );
    if (!driver || !truck) {
      throw new Error("Driver or truck not found");
    }
    const totalPickups = await this._pickupRepository.findDriverPlantTruckById({
      truckId,
      plantId,
      driverId,
    });
    const totalPickupsCount = totalPickups?.length || 0;

    let workType = "noEarning";
    if (totalPickupsCount >= 6) workType = "fullDay";
    else if (totalPickupsCount >= 4) workType = "halfDay";

    // const totalReward = totalPickups.reduce((sum, pickup) => {
    //   const baseAmount =
    //     pickup.wasteType === "Residential"
    //       ? 100
    //       : pickup.wasteType === "Commercial"
    //         ? 200
    //         : 0;
    //   const reward = baseAmount * 0.3;
    //   return sum + reward;
    // }, 0);

    const earnings =
      workType === "fullDay" ? 500 : workType === "halfDay" ? 300 : 0;

    const driverAttendance =
      await this._attendanceRepository.findDriverAttendance({
        truckId,
        plantId,
        driverId,
      });
    if (!driverAttendance) {
      throw new Error("Attendance record not found for today");
    }
    // driverAttendance.totalPickups = totalPickupsCount;
    driverAttendance.workType = workType;
    // driverAttendance.reward = totalReward;
    driverAttendance.earning = earnings;
    await driverAttendance.save();

    console.log({ earnings});
    
    return true;
  }
}

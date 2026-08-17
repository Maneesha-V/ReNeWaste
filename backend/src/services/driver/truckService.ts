import { ITruckService } from "./interface/ITruckService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { TruckMapper } from "../../mappers/TruckMapper";
import { DriverMapper } from "../../mappers/DriverMapper";
import { TruckAvailbleDTO } from "../../dtos/truck/truckDTO";
import { MarkReturnProps } from "../../dtos/driver/driverDTO";
import { IAttendanceRepository } from "../../repositories/atendance/interface/IAttendanceRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

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
    private _pickupRepository: IPickupRepository,
  ) {}
  async getTruckForDriver(
    driverId: string,
    wasteplantId: string,
  ): Promise<TruckAvailbleDTO[]> {
    const trucks = await this.truckRepository.getAssignedAvailableTrucks(
      driverId,
      wasteplantId,
    );
    if (!trucks || trucks.length === 0) {
      return [];
    }
    return TruckMapper.mapAvailableTrucksDTO(trucks);
  }
  async requestTruck(driverId: string) {
    const driver = await this.truckRepository.reqTruckToWastePlant(driverId);
    if (!driver) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.NOT_FOUND,
      );
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
      driverId,
    );
    if (!driver) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.NOT_FOUND,
      );
    }
    if (!truck) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_NOT_FOUND,
      );
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

    const earnings =
      workType === "fullDay" ? 500 : workType === "halfDay" ? 300 : 0;

    const driverAttendance =
      await this._attendanceRepository.findDriverAttendance({
        truckId,
        plantId,
        driverId,
      });
    if (!driverAttendance) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.ATTENDANCE_NOT,
      );
    }

    driverAttendance.workType = workType;
    driverAttendance.earning = earnings;
    await driverAttendance.save();

    console.log({ earnings });

    return true;
  }
}

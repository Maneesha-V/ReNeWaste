import { ITruckService } from "./interface/ITruckService";
import TruckRepository from "../../repositories/truck/truckRepository";
import DriverRepository from "../../repositories/driver/driverRepository";

class TruckService implements ITruckService {
   async getTruckForDriver (driverId: string) {
    const result = await TruckRepository.getAvailableTrucks(driverId);
    return result;
    }
    async requestTruck( driverId: string) {
        return await TruckRepository.reqTruckToWastePlant(driverId);
      }
}
export default new TruckService();
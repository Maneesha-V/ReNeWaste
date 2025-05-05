import { ITruckService } from "./interface/ITruckService";
import TruckRepository from "../../repositories/truck/truckRepository";
import DriverRepository from "../../repositories/driver/driverRepository";

class TruckService implements ITruckService {
   async requestTruck (driverId: string) {
    const result = await TruckRepository.getAvailableTrucks(driverId);
    return result;
    }
}
export default new TruckService();
import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";
import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";

export type MarkReturnProps = {
  truckId: string;
  plantId: string;
  driverId: string;
};
export type MarkTruckReturnResult = {
  driver: IDriverDocument;
  truck: ITruckDocument;
}
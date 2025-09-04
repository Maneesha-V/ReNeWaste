import { TruckDTO } from "../dtos/truck/truckDTO";
import { ITruckDocument } from "../models/truck/interfaces/truckInterface";

export class TruckMapper {
  static mapTruckDTO(doc: ITruckDocument): TruckDTO {
    return {
      _id: doc._id.toString(),
      name: doc.name ?? "",
      vehicleNumber: doc.vehicleNumber ?? "",
      capacity: doc.capacity,
      assignedDriver: doc.assignedDriver?.toString(),
      wasteplantId: doc.wasteplantId?.toString(),
      status: doc.status ?? "Pending",
      isReturned: doc.isReturned,
      tareWeight: doc.tareWeight,
      isDeleted: doc.isDeleted,
    };
  }
  static mapTrucksDTO(docs: ITruckDocument[]): TruckDTO[] {
    return docs.map((doc) => this.mapTruckDTO(doc));
  }
}

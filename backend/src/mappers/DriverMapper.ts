import { DriverDTO } from "../dtos/driver/driverDTO";
import { IDriverDocument } from "../models/driver/interfaces/driverInterface";

export class DriverMapper {
  static mapDriverDTO(doc: IDriverDocument): DriverDTO {
    return {
      _id: doc._id.toString(),
      name: doc.name ?? "",
      email: doc.email ?? "",
      licenseNumber: doc.licenseNumber ?? "",
      contact: doc.contact,
      experience: doc.experience,
      status: doc.status ?? "Pending",
      licenseFront: doc.licenseFront,
      licenseBack: doc.licenseBack,
      role: doc.role,
      wasteplantId: doc.wasteplantId?.toString(),
      assignedTruckId: doc.assignedTruckId?.toString(),
      assignedZone: doc.assignedZone ?? "",
      hasRequestedTruck: doc.hasRequestedTruck,
      category: doc.category,
      isDeleted: doc.isDeleted,
    };
  }
  static mapDriversDTO(docs: IDriverDocument[]): DriverDTO[] {
    return docs.map((doc) => this.mapDriverDTO(doc));
  }
}

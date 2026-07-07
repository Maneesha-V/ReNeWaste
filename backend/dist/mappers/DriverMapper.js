"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverMapper = void 0;
class DriverMapper {
    static mapDriverDTO(doc) {
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
    static mapDriversDTO(docs) {
        return docs.map((doc) => this.mapDriverDTO(doc));
    }
}
exports.DriverMapper = DriverMapper;

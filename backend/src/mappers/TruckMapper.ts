import {
  ITruckExtDocument,
  TruckAvailbleDTO,
  TruckDTO,
} from "../dtos/truck/truckDTO";
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
  static mapAvailableTruckDTO(doc: ITruckExtDocument): TruckAvailbleDTO {
    return {
      _id: doc._id.toString(),
      name: doc.name ?? "",
      vehicleNumber: doc.vehicleNumber ?? "",
      capacity: doc.capacity ?? 0,
      assignedDriver: doc.assignedDriver?.toString(),
      wasteplantId: {
        _id: doc.wasteplantId?._id?.toString() ?? "",
        plantName: doc.wasteplantId?.plantName ?? "",
        ownerName: doc.wasteplantId?.ownerName ?? "",
        location: doc.wasteplantId?.location ?? "",
        district: doc.wasteplantId?.district ?? "",
        taluk: doc.wasteplantId?.taluk ?? "",
        pincode: doc.wasteplantId?.pincode ?? "",
        state: doc.wasteplantId?.state ?? "",
        contactInfo: doc.wasteplantId?.contactInfo ?? "",
        contactNo: doc.wasteplantId?.contactNo ?? "",
        email: doc.wasteplantId?.email ?? "",
        licenseNumber: doc.wasteplantId?.licenseNumber ?? "",
        capacity: doc.wasteplantId?.capacity ?? 0,
        status: doc.wasteplantId?.status ?? "Pending",
        subscriptionPlan: doc.wasteplantId?.subscriptionPlan ?? "",
        role: doc.wasteplantId?.role,
        services: Array.isArray(doc.wasteplantId?.services)
          ? doc.wasteplantId?.services
          : [],
        licenseDocumentPath: doc.wasteplantId?.licenseDocumentPath ?? "",
        cloudinaryPublicId: doc.wasteplantId?.cloudinaryPublicId ?? "",
        isBlocked: doc.wasteplantId?.isBlocked,
        blockedAt: doc.wasteplantId?.blockedAt ?? null,
        autoUnblockAt: doc.wasteplantId?.autoUnblockAt ?? null,
        unblockNotificationSent: doc.wasteplantId?.unblockNotificationSent,
        autoSubscribeAt: doc.wasteplantId?.autoSubscribeAt ?? null,
        subscribeNotificationSent: doc.wasteplantId?.subscribeNotificationSent,
        autoRechargeAt: doc.wasteplantId?.autoRechargeAt ?? null,
        rechargeNotificationSent: doc.wasteplantId?.rechargeNotificationSent,
        renewNotificationSent: doc.wasteplantId?.renewNotificationSent,
      },
      status: doc.status ?? "Pending",
      isReturned: doc.isReturned,
      tareWeight: doc.tareWeight ?? 0,
      isDeleted: doc.isDeleted,
    };
  }
  static mapAvailableTrucksDTO(
    docs: (ITruckDocument | ITruckExtDocument)[]
  ): TruckAvailbleDTO[] {
    return docs.map((doc) =>
      this.mapAvailableTruckDTO(doc as ITruckExtDocument)
    );
  }
}

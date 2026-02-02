import { PopulatedRef } from "../dtos/base/BaseDTO";
import {
  IWasteCollectionPopulatedDocument,
  PopulatedWasteCollectionDTO,
  WasteCollectionDTO,
} from "../dtos/wasteCollection/wasteCollectionDTO";
import { IWasteCollectionDocument } from "../models/wasteCollection/interfaces/wasteCollectionInterface";

export class WasteCollectionMapper {
  static mapWasteCollectionDTO(
    doc: IWasteCollectionDocument,
  ): WasteCollectionDTO {
    return {
      _id: doc._id.toString(),
      driverId: doc.driverId.toString(),
      truckId: doc.truckId.toString(),
      wasteplantId: doc.wasteplantId.toString(),
      measuredWeight: doc.measuredWeight,
      collectedWeight: doc.collectedWeight,
      wasteType: doc.wasteType ?? "",
      returnedAt: doc.returnedAt ?? null,
    };
  }
  static mapWasteCollectionsDTO(
    docs: IWasteCollectionDocument[],
  ): WasteCollectionDTO[] {
    return docs.map((doc) => this.mapWasteCollectionDTO(doc));
  }
  
  static mapPopulatedWasteCollectionDTO(
    doc: IWasteCollectionDocument,
  ): PopulatedWasteCollectionDTO {
    const driver = doc.driverId as unknown as PopulatedRef | null;
    const truck = doc.truckId as unknown as PopulatedRef | null;
    return {
      _id: doc._id.toString(),
      driver: driver
        ? {
            _id: driver._id.toString(),
            name: driver.name,
          }
        : null,
      truck: truck
        ? {
            _id: truck._id.toString(),
            name: truck.name,
          }
        : null,
      wasteplantId: doc.wasteplantId.toString(),
      measuredWeight: doc.measuredWeight,
      collectedWeight: doc.collectedWeight,
      wasteType: doc.wasteType ?? "",
      returnedAt: doc.returnedAt ?? null,
    };
  }
  static mapPopulatedWasteCollectionsDTO(
    docs: IWasteCollectionDocument[],
  ): PopulatedWasteCollectionDTO[] {
    return docs.map((doc) => this.mapPopulatedWasteCollectionDTO(doc));
  }
}

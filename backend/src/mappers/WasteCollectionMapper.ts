import { WasteCollectionDTO } from "../dtos/wasteCollection/wasteCollectionDTO";
import { IWasteCollectionDocument } from "../models/wasteCollection/interfaces/wasteCollectionInterface";

export class WasteCollectionMapper {
  static mapWasteCollectionDTO(doc: IWasteCollectionDocument): WasteCollectionDTO {
    return {
      _id: doc._id.toString(),
      driverId: doc.driverId.toString(),
      truckId: doc.driverId.toString(),
      wasteplantId: doc.wasteplantId.toString(),
      measuredWeight: doc.measuredWeight,
      collectedWeight: doc.collectedWeight,
      wasteType: doc.wasteType ?? "",
      returnedAt: doc.returnedAt ?? null,
    };
  }
  static mapWasteCollectionsDTO(docs: IWasteCollectionDocument[]): WasteCollectionDTO[] {
    return docs.map((doc) => this.mapWasteCollectionDTO(doc));
  }
}

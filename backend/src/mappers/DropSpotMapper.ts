import { DropSpotDTO } from "../dtos/dropspots/dropSpotDTO";
import { IDropSpotDocument } from "../models/dropSpots/interfaces/dropSpotInterface";

export class DropSpotMapper {
  static mapDropSpotDTO(doc: IDropSpotDocument): DropSpotDTO {
    return {
      _id: doc._id.toString(),
      dropSpotName: doc.dropSpotName ?? "",
      addressLine: doc.addressLine ?? "",
      location: doc.location ?? "",
      pincode: doc.pincode ?? "",
      state: doc.state ?? "",
      district: doc.district ?? "",
      wasteplantId: doc.wasteplantId.toString(),
      coordinates: {
        lat: doc.coordinates.lat ?? 0,
        lng: doc.coordinates.lng ?? 0,
      },
    };
  }
  static mapDropSpotsDTO(docs: IDropSpotDocument[]): DropSpotDTO[] {
    return docs.map((doc) => this.mapDropSpotDTO(doc));
  }
}

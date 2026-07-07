"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropSpotMapper = void 0;
class DropSpotMapper {
    static mapDropSpotDTO(doc) {
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
    static mapDropSpotsDTO(docs) {
        return docs.map((doc) => this.mapDropSpotDTO(doc));
    }
}
exports.DropSpotMapper = DropSpotMapper;

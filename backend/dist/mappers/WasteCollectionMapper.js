"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasteCollectionMapper = void 0;
class WasteCollectionMapper {
    static mapWasteCollectionDTO(doc) {
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
    static mapWasteCollectionsDTO(docs) {
        return docs.map((doc) => this.mapWasteCollectionDTO(doc));
    }
    static mapPopulatedWasteCollectionDTO(doc) {
        const driver = doc.driverId;
        const truck = doc.truckId;
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
    static mapPopulatedWasteCollectionsDTO(docs) {
        return docs.map((doc) => this.mapPopulatedWasteCollectionDTO(doc));
    }
}
exports.WasteCollectionMapper = WasteCollectionMapper;

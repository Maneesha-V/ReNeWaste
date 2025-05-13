
export interface IMapService {
    getAndSaveETA(origin: string, destination: string, pickupReqId: string, addressId: string): Promise<any>;
}


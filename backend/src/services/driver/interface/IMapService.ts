
export interface IMapService {
    getAndSaveETA(origin: string, destination: string, pickupReqId: string): Promise<any>;
}


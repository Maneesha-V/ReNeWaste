import { inject, injectable } from "inversify";
import { IPickupRequest, IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { IPickupService } from "./interface/IPickupService";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { PickupDriverFilterParams } from "../../dtos/pickupReq/pickupReqDTO";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
  ){}
  async getPickupRequestService(
    filters: PickupDriverFilterParams
  ) {
    return await this.pickupRepository.getPickupsByDriverId(filters);
  }
  async getPickupByIdForDriver(pickupReqId: string, driverId: string) {
    const pickup = await this.pickupRepository.findPickupByIdAndDriver(pickupReqId, driverId);
    return pickup;
  }
  async updateAddressLatLngService(addressId: string, latitude: number, longitude: number): Promise<any> {
    return await this.userRepository.updateAddressByIdLatLng(addressId, latitude, longitude);
  }
  async updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<IPickupRequestDocument | null> {
    return await this.pickupRepository.updateTrackingStatus(pickupReqId, trackingStatus);
  }
  
   async markPickupCompletedService(
    pickupReqId: string
  ): Promise<IPickupRequestDocument | null> {
    return await this.pickupRepository.markPickupCompletedStatus(pickupReqId);
  }
}

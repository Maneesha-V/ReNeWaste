import { inject, injectable } from "inversify";
import { IPickupRequest, IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { IPickupService } from "./interface/IPickupService";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { EnhancedPickup, IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { PickupDriverFilterParams, PickupReqDTO, PickupReqGetDTO } from "../../dtos/pickupReq/pickupReqDTO";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { MarkPickupCompletedResp } from "../../dtos/driver/driverDTO";
import { UserMapper } from "../../mappers/UserMapper";
import { AddressDTO } from "../../dtos/user/userDTO";

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
  ): Promise<PickupReqGetDTO[]> {
    const result = await this.pickupRepository.getPickupsByDriverId(filters);
    return PickupRequestMapper.mapPickupReqsGetDTO(result)
  }
  async getPickupByIdForDriver(pickupReqId: string, driverId: string): Promise<PickupReqGetDTO> {
    const pickup = await this.pickupRepository.findPickupByIdAndDriver(pickupReqId, driverId);
    console.log("pickup",pickup);
    return PickupRequestMapper.mapGetPickupReqDTO(pickup);
  }
  async updateAddressLatLngService(addressId: string, latitude: number, longitude: number): Promise<AddressDTO> {
    const  updatedUser = await this.userRepository.updateAddressByIdLatLng(addressId, latitude, longitude);
    const updatedAddress = updatedUser.addresses.id(addressId);
    if (!updatedAddress) {
      throw new Error("Updated address not found");
    }
    return UserMapper.mapAddressDTO(updatedAddress)
  }
  async updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<PickupReqDTO> {
    const pickup = await this.pickupRepository.updateTrackingStatus(pickupReqId, trackingStatus);
    return PickupRequestMapper.mapPickupReqDTO(pickup);
  }
  
   async markPickupCompletedService(
    pickupReqId: string
  ): Promise<MarkPickupCompletedResp> {
    const pickup = await this.pickupRepository.markPickupCompletedStatus(pickupReqId);
    if(!pickup){
      throw new Error("Not mark pickup.")
    }
    return {
        pickupReqId: pickup._id.toString(),
        status: pickup.status,
    }
  }
}

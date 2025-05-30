import { IResidentialService } from "./interface/IResidentialService";
import { Types } from "mongoose";
import { IAddress } from "../../models/user/interfaces/addressInterface";
import { IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";

@injectable()
export class ResidentialService implements IResidentialService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
  ) {}
  async getResidentialService(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateResidentialPickupService(userId: string, updatedData: any) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = await this.userRepository.updatePartialProfileById(
      userId,
      updatedData
    );
    if (!updatedUser) throw new Error("User update failed");
    let addressIdToUse: Types.ObjectId;
    if (updatedUser.addresses?.length) {
      const addressList = updatedUser.addresses;
      const latestAddress = addressList[addressList.length - 1] as IAddress & {
        _id: Types.ObjectId;
      };
      console.log("latestAddress", latestAddress);

      if (!latestAddress || !latestAddress._id)
        throw new Error("Address ID not found");
      
      addressIdToUse = new Types.ObjectId(latestAddress._id);
    } else if (updatedData.selectedAddressId) {
      addressIdToUse = new Types.ObjectId(updatedData.selectedAddressId);
    } else {
      throw new Error("No address provided or selected.");
    }
    const newPickuData = {
      userId: new Types.ObjectId(userId),
      wasteplantId: user?.wasteplantId,
      addressId: addressIdToUse,
      wasteType: updatedData.wasteType,
      originalPickupDate: updatedData.pickupDate,
      pickupTime: updatedData.pickupTime,
      status: "Pending",
    };
    const newPickupReq: IPickupRequestDocument =
      await this.pickupRepository.createPickup(newPickuData);
    return { user: updatedUser, pickupRequest: newPickupReq };
  }
}

import { IResidentialService } from "./interface/IResidentialService";
import { Types } from "mongoose";
import { IAddress } from "../../models/user/interfaces/addressInterface";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { UpdatedResidentialData, UserDTO } from "../../dtos/user/userDTO";
import { UserMapper } from "../../mappers/UserMapper";

@injectable()
export class ResidentialService implements IResidentialService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
  ) {}
  async getResidentialService(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return UserMapper.mapUserDTO(user);
  }

  async updateResidentialPickupService(
    userId: string,
    updatedData: UpdatedResidentialData,
  ): Promise<boolean> {
    const { wasteType, pickupDate } = updatedData;
    const existing = await this.pickupRepository.checkExistingResid({
      userId,
      wasteType,
      pickupDate,
    });
    if (existing?.type === "daily") {
      throw new Error("You can only request one residential pickup per day.");
    }
    const pickupCount =
      await this.pickupRepository.getMonthlyPickupPlansByUserId(userId);

    if (pickupCount.count >= 4) {
      throw new Error("Monthly residential pickup limit exceeded (max 4).");
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = await this.userRepository.updatePartialProfileById(
      userId,
      updatedData,
    );
    if (!updatedUser) throw new Error("User update failed");
    let addressIdToUse: Types.ObjectId;
    if (updatedUser.addresses?.length) {
      const addressList = updatedUser.addresses;
      const latestAddress = addressList[addressList.length - 1] as IAddress & {
        _id: Types.ObjectId;
      };
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
      originalPickupDate: new Date(updatedData.pickupDate),
      pickupTime: updatedData.pickupTime,
      status: "Pending",
    };

    const created = await this.pickupRepository.createPickup(newPickuData);
    return !!created;
  }
}

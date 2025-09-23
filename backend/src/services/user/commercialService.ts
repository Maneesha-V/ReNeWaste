import { ICommercialService } from "./interface/ICommercialService";
import { Types } from "mongoose";
import { IAddress } from "../../models/user/interfaces/addressInterface";
import { IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { UpdatedCommercialDataDTO, UserDTO } from "../../dtos/user/userDTO";
import { UserMapper } from "../../mappers/UserMapper";

@injectable()
export class CommercialService implements ICommercialService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
  ) {}
  async getCommercialService(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return UserMapper.mapUserDTO(user);;
  }
  async availableWasteService(
    service: string,
    wasteplantId: string
  ): Promise<boolean> {
    const wasteplant = await this.wastePlantRepository.getWastePlantById(
      wasteplantId
    );
    if (!wasteplant || !Array.isArray(wasteplant.services)) return false;

    return wasteplant.services.includes(service);
  }
  async updateCommercialPickupService(userId: string, updatedData: UpdatedCommercialDataDTO):
  Promise<boolean> {
    const {frequency, businessName, wasteType } = updatedData
    const existing = await this.pickupRepository.checkExistingBusiness({userId,frequency, businessName, wasteType})
      if (existing?.type === "monthly") {
    throw new Error("You already submitted a pickup for this business this month.");
  }
     if (existing?.type === "daily") {
    throw new Error("You can only submit one commercial pickup request per day.");
  }
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
      service: updatedData.service,
      businessName: updatedData.businessName,
      frequency: updatedData.frequency,
      status: "Pending",
    };

    const created = await this.pickupRepository.createPickup(newPickuData);
    return !!created;
  }
}

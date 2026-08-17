import { IResidentialService } from "./interface/IResidentialService";
import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { UpdatedResidentialData, UserDTO } from "../../dtos/user/userDTO";
import { UserMapper } from "../../mappers/UserMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

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
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    return UserMapper.mapUserDTO(user);
  }

  async updateResidentialPickupService(
    userId: string,
    updatedData: UpdatedResidentialData,
  ): Promise<boolean> {
    const { wasteType, pickupDate, selectedAddressId } = updatedData;
    const existing = await this.pickupRepository.checkExistingResid({
      userId,
      wasteType,
      pickupDate,
    });
    if (existing?.type === "daily") {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.USER.ERROR.RESIDENTIAL_LIMIT,
      );
    }
    const pickupCount =
      await this.pickupRepository.getMonthlyPickupPlansByUserId(userId);

    if (pickupCount.count >= 4) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.USER.ERROR.MONTHLY_LIMIT,
      );
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }

    const updatedUser = await this.userRepository.updatePartialProfileById(
      userId,
      updatedData,
    );
    if (!updatedUser) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.PROFILE_UPDATE,
      );
    }
    let selectedAddress = null;

    if (selectedAddressId) {
      selectedAddress =
        updatedUser.addresses?.find(
          (addr) => addr._id?.toString() === selectedAddressId,
        ) ?? null;
    } else {
      selectedAddress =
        updatedUser.addresses?.[updatedUser.addresses.length - 1] ?? null;
    }

    if (!selectedAddress) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.NO_ADDRESS,
      );
    }
    if (
      !selectedAddress.addressLine1?.trim() ||
      !selectedAddress.addressLine2?.trim() ||
      !selectedAddress.location?.trim()
    ) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.COMPLETE_ADDRESS,
      );
    }

    const newPickuData = {
      userId: new Types.ObjectId(userId),
      wasteplantId: user?.wasteplantId,
      addressId: new Types.ObjectId(selectedAddress._id),
      wasteType: updatedData.wasteType,
      originalPickupDate: new Date(updatedData.pickupDate),
      pickupTime: updatedData.pickupTime,
      status: "Pending",
    };

    const created = await this.pickupRepository.createPickup(newPickuData);
    return !!created;
  }
}

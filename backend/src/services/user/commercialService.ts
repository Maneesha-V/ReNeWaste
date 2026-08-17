import { ICommercialService } from "./interface/ICommercialService";
import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { UpdatedCommercialDataDTO, UserDTO } from "../../dtos/user/userDTO";
import { UserMapper } from "../../mappers/UserMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class CommercialService implements ICommercialService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
  ) {}
  async getCommercialService(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    return UserMapper.mapUserDTO(user);
  }
  async availableWasteService(
    service: string,
    wasteplantId: string,
  ): Promise<boolean> {
    const wasteplant =
      await this.wastePlantRepository.getWastePlantById(wasteplantId);
    if (!wasteplant || !Array.isArray(wasteplant.services)) return false;

    return wasteplant.services.includes(service);
  }
  async updateCommercialPickupService(
    userId: string,
    updatedData: UpdatedCommercialDataDTO,
  ): Promise<boolean> {
    const { frequency, businessName, wasteType } = updatedData;
    const existing = await this.pickupRepository.checkExistingBusiness({
      userId,
      frequency,
      businessName,
      wasteType,
    });
    if (existing?.type === "monthly") {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.USER.ERROR.COMM_MONTHLY_LIMIT,
      );
    }
    if (existing?.type === "daily") {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.USER.ERROR.COMMERCIAL_LIMIT,
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

    if (updatedData.selectedAddressId) {
      selectedAddress =
        updatedUser.addresses?.find(
          (addr) => addr._id?.toString() === updatedData.selectedAddressId,
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

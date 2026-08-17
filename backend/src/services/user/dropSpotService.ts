import { IDropSpotService } from "./interface/IDropSpotservice";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IDropSpotRepository } from "../../repositories/dropSpot/interface/IDropSpotRepository";
import { DropSpotDTO } from "../../dtos/dropspots/dropSpotDTO";
import { DropSpotMapper } from "../../mappers/DropSpotMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class DropSpotService implements IDropSpotService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.DropSpotRepository)
    private dropSpotRepository: IDropSpotRepository,
  ) {}
  async getAllNearDropSpots(userId: string): Promise<DropSpotDTO[]> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    if (!user.addresses || user.addresses.length === 0) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.NO_ADDRESS,
      );
    }

    const userAddress = user.addresses[0];
    
    const { location, district, state } = userAddress;
    const wasteplantId = user.wasteplantId;

    if (!wasteplantId) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.ID_MISSING,
      );
    }
    const dropspots =
      await this.dropSpotRepository.getDropSpotsByLocationAndWasteplant({
        location,
        district,
        state,
        wasteplantId,
      });
    console.log("drops", dropspots);

    if (!dropspots) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.DROPSPOTS_NOT_FOUND,
      );
    }
    return DropSpotMapper.mapDropSpotsDTO(dropspots);
  }
}

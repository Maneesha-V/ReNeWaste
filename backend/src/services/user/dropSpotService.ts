import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import { IDropSpotService } from "./interface/IDropSpotservice";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IDropSpotRepository } from "../../repositories/dropSpot/interface/IDropSpotRepository";

@injectable()
export class DropSpotService implements IDropSpotService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.DropSpotRepository)
    private dropSpotRepository: IDropSpotRepository
  ){}
  async getAllNearDropSpots(userId: string): Promise<IDropSpot[]> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) throw new Error("User not found");
    if (!user.addresses || user.addresses.length === 0) {
      throw new Error("No address found for user");
    }

    const userAddress = user.addresses[0];
    const { location, district, state } = userAddress;
    const wasteplantId = user.wasteplantId;
    if (!wasteplantId) {
      throw new Error("User's wasteplantId is missing");
    }
    return await this.dropSpotRepository.getDropSpotsByLocationAndWasteplant({
      location,
      district,
      state,
      wasteplantId,
    });
  }
}


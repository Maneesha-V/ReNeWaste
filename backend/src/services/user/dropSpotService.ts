import { IDropSpotService } from "./interface/IDropSpotservice";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IDropSpotRepository } from "../../repositories/dropSpot/interface/IDropSpotRepository";
import { DropSpotDTO } from "../../dtos/dropspots/dropSpotDTO";
import { DropSpotMapper } from "../../mappers/DropSpotMapper";

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

    if (!user) throw new Error("User not found");
    if (!user.addresses || user.addresses.length === 0) {
      throw new Error("No address found for user");
    }

    const userAddress = user.addresses[0];
    console.log("userAddress",userAddress);
    
    const { location, district, state } = userAddress;
    const wasteplantId = user.wasteplantId;
  
    if (!wasteplantId) {
      throw new Error("User's wasteplantId is missing");
    }
    const dropspots =
      await this.dropSpotRepository.getDropSpotsByLocationAndWasteplant({
        location,
        district,
        state,
        wasteplantId,
      });
      console.log("drops",dropspots);
      
    if (!dropspots) {
      throw new Error("Drop spots not found.");
    }
    return DropSpotMapper.mapDropSpotsDTO(dropspots);
  }
}

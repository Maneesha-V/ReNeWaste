import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import DropSpotRepository from "../../repositories/dropSpot/dropSpotRepository";
import { IDropSpotService } from "./interface/IDropSpotservice";
import UserRepository from "../../repositories/user/userRepository";

class DropSpotService implements IDropSpotService {
  async getAllNearDropSpots(userId: string): Promise<IDropSpot[]> {
    const user = await UserRepository.findUserById(userId);

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
    return await DropSpotRepository.getDropSpotsByLocationAndWasteplant({
      location,
      district,
      state,
      wasteplantId,
    });
  }
}
export default new DropSpotService();

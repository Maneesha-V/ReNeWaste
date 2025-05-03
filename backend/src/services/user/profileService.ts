import UserRepository from "../../repositories/user/userRepository";
import WastePlantRepository  from "../../repositories/wastePlant/wastePlantRepository";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { IProfileService } from "./interface/IProfileService";
import { IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { ProfileRequest } from "../../types/user/profileTypes";

class ProfileService implements IProfileService {
  async getUserProfile(userId: string) {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserProfile(userId: string, updatedData: any) {
    try {
      const user = await UserRepository.findUserById(userId);
      if (!user) throw new Error("User not found");
      const userTaluk = updatedData?.addresses?.[0]?.taluk;
      if (userTaluk) {
        updatedData.wasteplantId = await WastePlantRepository.findWastePlantByTaluk(userTaluk)
      } else {
        console.error(`No waste plant found for taluk: ${userTaluk}`);
        updatedData.wasteplantId = null;;
      }
      updatedData.addresses = updatedData.addresses.map(
        (addr: { _id?: string; [key: string]: any }) => {
          const { _id, ...rest } = addr;
          return { ...rest };
        }
      );
      
      return await UserRepository.updateUserProfileById(userId, updatedData);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

export default new ProfileService();

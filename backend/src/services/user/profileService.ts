import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
  ){}
  async getUserProfile(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserProfile(userId: string, updatedData: any) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) throw new Error("User not found");
      const userTaluk = updatedData?.addresses?.[0]?.taluk;
      if (userTaluk) {
        updatedData.wasteplantId = await this.wastePlantRepository.findWastePlantByTaluk(userTaluk)
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
      
      return await this.userRepository.updateUserProfileById(userId, updatedData);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}


import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { UserMapper } from "../../mappers/UserMapper";
import { UserDTO } from "../../dtos/user/userDTO";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
  ) {}
  async getUserProfile(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return UserMapper.mapUserDTO(user);
  }

  async updateUserProfile(
    userId: string,
    updatedData: UserDTO
  ): Promise<boolean> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    const userTaluk = updatedData?.addresses?.[0]?.taluk;
    if (userTaluk) {
      updatedData.wasteplantId =
        await this.wastePlantRepository.findWastePlantByTaluk(userTaluk);
    } else {
      console.error(`No waste plant found for taluk: ${userTaluk}`);
      updatedData.wasteplantId = null;
    }
    // const dataToUpdate: Partial<UserDTO> = { ...updatedData };

    // if (dataToUpdate.googleId === null || dataToUpdate.googleId === "") {
    //   delete dataToUpdate.googleId;
    // }
    const updated = await this.userRepository.updateUserProfileById(
      userId,
      updatedData
    );
    return !!updated;
  }
}

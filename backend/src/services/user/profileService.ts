import UserRepository from "../../repositories/user/userRepository";
import { IProfileService } from "./interface/IProfileService";

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

      return await UserRepository.updateUserProfileById(userId, updatedData);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

export default new ProfileService();

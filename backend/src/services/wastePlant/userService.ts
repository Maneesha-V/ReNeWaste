import { IUser } from "../../models/user/interfaces/userInterface";
import { IUserService } from "./interface/IUserService";
import UserRepository from "../../repositories/user/userRepository";
import { PaginatedUsersResult } from "../../types/wastePlant/userTypes";

class UserService implements IUserService {
  async getAllUsers(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedUsersResult> {
    return await UserRepository.getUsersByWastePlantId(wasteplantId, page, limit, search);
  }
  
  async userBlockStatusService(
  wasteplantId: string,
  userId: string,
  isBlocked: boolean
) {
  const user = await UserRepository.findUserById(userId)
 if (!user || !user.wasteplantId || String(user.wasteplantId) !== String(wasteplantId)) {
    return null;
  }
  user.isBlocked = isBlocked;
  await user.save({ validateModifiedOnly: true});

  return user;
};
}
export default new UserService();

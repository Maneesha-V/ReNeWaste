import { IUser } from "../../models/user/interfaces/userInterface";
import { IUserService } from "./interface/IUserService";
import { PaginatedUsersResult } from "../../types/wastePlant/userTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ){}
  async getAllUsers(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedUsersResult> {
    return await this.userRepository.getUsersByWastePlantId(wasteplantId, page, limit, search);
  }
  
  async userBlockStatusService(
  wasteplantId: string,
  userId: string,
  isBlocked: boolean
) {
  const user = await this.userRepository.findUserById(userId)
 if (!user || !user.wasteplantId || String(user.wasteplantId) !== String(wasteplantId)) {
    return null;
  }
  user.isBlocked = isBlocked;
  await user.save({ validateModifiedOnly: true});

  return user;
};
}


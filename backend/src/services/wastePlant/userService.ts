import { IUser } from "../../models/user/interfaces/userInterface";
import { IUserService } from "./interface/IUserService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { PaginatedResult } from "../../dtos/user/userDTO";
import { UserMapper } from "../../mappers/UserMapper";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ){}
  async getAllUsers(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedResult> {
    const { users, total } = await this.userRepository.getUsersByWastePlantId(wasteplantId, page, limit, search);
    return {
      users: UserMapper.mapUsersDTO(users),
      total
    }
  }
  
  async userBlockStatusService(
  wasteplantId: string,
  userId: string,
  isBlocked: boolean
) {
  const user = await this.userRepository.findUserById(userId)
 if (!user || !user.wasteplantId || String(user.wasteplantId) !== String(wasteplantId)) {
    throw new Error("User not found");
  }
  user.isBlocked = isBlocked;
  await user.save({ validateModifiedOnly: true});

  return UserMapper.mapUserDTO(user);
};
}


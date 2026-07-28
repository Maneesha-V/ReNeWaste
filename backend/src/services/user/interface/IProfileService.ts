import { UpdateUserServiceAdd } from "../../../dtos/common/commonDTO";
import { UserDTO } from "../../../dtos/user/userDTO";

export interface IProfileService {
  getUserProfile(userId: string): Promise<UserDTO>;
  updateUserProfile(userId: string, updatedData: UserDTO): Promise<boolean>;
  updateUserServiceAddress(locationData: UpdateUserServiceAdd): Promise<boolean>;
}

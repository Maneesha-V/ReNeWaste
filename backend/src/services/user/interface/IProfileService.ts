import { UserDTO } from "../../../dtos/user/userDTO";

export interface IProfileService {
    getUserProfile(userId: string): Promise<UserDTO>;
    updateUserProfile(userId: string, updatedData: UserDTO): Promise<boolean>;
  }
  
import { PaginatedResult, UserDTO } from "../../../dtos/user/userDTO";

export interface IUserService {
  getAllUsers(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedResult>;

  userBlockStatusService(
    wasteplantId: string,
    userId: string,
    isBlocked: boolean
  ): Promise<UserDTO>;
}

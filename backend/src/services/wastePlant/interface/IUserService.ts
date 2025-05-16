import { IUser } from "../../../models/user/interfaces/userInterface";
import { PaginatedUsersResult } from "../../../types/wastePlant/userTypes";

export interface IUserService {
      getAllUsers(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedUsersResult>;

  userBlockStatusService(
    wasteplantId: string,
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null>;
}
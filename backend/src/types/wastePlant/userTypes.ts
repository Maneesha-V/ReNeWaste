import { IUser } from "../../models/user/interfaces/userInterface";

export interface PaginatedUsersResult {
  users: IUser[];
  total: number;
}
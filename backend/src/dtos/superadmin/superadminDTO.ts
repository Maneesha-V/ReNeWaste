import { BaseDTO } from "../base/BaseDTO";
import { Role } from "../user/userDTO";

export interface SuperAdminDTO extends BaseDTO {
  username: string;
  email: string;
  role: Role;
  // createdAt?: Date;
}
export type SuperAdminSignupRequest = {
  username: string;
  email: string;
  password: string;
};
// export type SuperAdminSignupResponse = {
//   admin: SuperAdminDTO;
//   token: string;
// }
export type SuperAdminLoginRequest = {
  email: string;
  password: string;
};
export type SuperAdminLoginResponse = {
  admin: SuperAdminDTO;
  token: string;
};
export interface SuperAdminDashboardData {
  adminData: {
    name: string;
  };
  totalPlants: number;
  totalTrucks: number;
  totalDrivers: number;
  totalWasteCollected: number;
  monthlyRevenue: { month: string; totalRevenue: number }[];
}

import { ISuperAdmin, ISuperAdminDocument } from "../../../models/superAdmin/interfaces/superAdminInterface";

export interface ISuperAdminRepository {
  findAdminByEmail(email: string): Promise<ISuperAdminDocument | null>;
  findAdminByUsername(username: string): Promise<ISuperAdminDocument | null>;
  createAdmin(adminData: ISuperAdmin): Promise<ISuperAdminDocument>;
  updateAdminPassword(email: string, hashedPassword: string): Promise<void>;
}

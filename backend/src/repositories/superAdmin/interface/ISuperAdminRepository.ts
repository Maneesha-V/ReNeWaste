import {
  ISuperAdmin,
  ISuperAdminDocument,
} from "../../../models/superAdmin/interfaces/superAdminInterface";
import IBaseRepository from "../../baseRepository/interface/IBaseRepository";

export interface ISuperAdminRepository
  extends IBaseRepository<ISuperAdminDocument> {
  getSuperAdminById(adminId: string): Promise<ISuperAdminDocument | null>;
  findAdminByEmail(email: string): Promise<ISuperAdminDocument | null>;
  findAdminByUsername(username: string): Promise<ISuperAdminDocument | null>;
  createAdmin(adminData: ISuperAdmin): Promise<ISuperAdminDocument>;
  updateAdminPassword(email: string, hashedPassword: string): Promise<boolean>;
  findAdminByRole(role: string): Promise<ISuperAdminDocument | null>;
}

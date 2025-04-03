import { ISuperAdminDocument } from "../../../models/superAdmin/interfaces/superAdminInterface";

export interface ISuperAdminRepository {
  findAdminByEmail(email: string): Promise<ISuperAdminDocument | null>;
}

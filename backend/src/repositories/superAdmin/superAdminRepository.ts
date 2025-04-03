import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";
import { SuperAdminModel } from "../../models/superAdmin/superAdminModel";
import { ISuperAdminRepository } from "./interface/ISuperAdminRepository";

class SuperAdminRepository implements ISuperAdminRepository {
  async findAdminByEmail(email: string): Promise<ISuperAdminDocument | null> {
    return await SuperAdminModel.findOne({ email }).exec();
  }
}

export default new SuperAdminRepository();
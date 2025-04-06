import {
  ISuperAdmin,
  ISuperAdminDocument,
} from "../../models/superAdmin/interfaces/superAdminInterface";
import { SuperAdminModel } from "../../models/superAdmin/superAdminModel";
import { ISuperAdminRepository } from "./interface/ISuperAdminRepository";

class SuperAdminRepository implements ISuperAdminRepository {
  async findAdminByEmail(email: string): Promise<ISuperAdminDocument | null> {
    return await SuperAdminModel.findOne({ email }).exec();
  }
  async findAdminByUsername(
    username: string
  ): Promise<ISuperAdminDocument | null> {
    return await SuperAdminModel.findOne({ username }).exec();
  }
  async createAdmin(adminData: ISuperAdmin): Promise<ISuperAdminDocument> {
    const admin = new SuperAdminModel(adminData);
    return await admin.save();
  }
  async updateAdminPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await SuperAdminModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
}

export default new SuperAdminRepository();

import { injectable } from "inversify";
import {
  ISuperAdmin,
  ISuperAdminDocument,
} from "../../models/superAdmin/interfaces/superAdminInterface";
import { SuperAdminModel } from "../../models/superAdmin/superAdminModel";
import { ISuperAdminRepository } from "./interface/ISuperAdminRepository";
import BaseRepository from "../baseRepository/baseRepository";

@injectable()
export class SuperAdminRepository extends BaseRepository<ISuperAdminDocument> implements ISuperAdminRepository {
  constructor() {
    super(SuperAdminModel);
  }
  async getSuperAdminById(adminId: string): Promise<ISuperAdminDocument | null> {
    return this.model.findById(adminId).exec();
  }

  async findAdminByEmail(email: string): Promise<ISuperAdminDocument | null> {
    return this.model.findOne({ email }).exec();
  }

  async findAdminByUsername(username: string): Promise<ISuperAdminDocument | null> {
    return this.model.findOne({ username }).exec();
  }

  async createAdmin(adminData: ISuperAdmin): Promise<ISuperAdminDocument> {
    const admin = new this.model(adminData);
    return admin.save();
  }

  async updateAdminPassword(email: string, hashedPassword: string): Promise<boolean> {
    await this.model.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
    return true;
  }
  async findAdminByRole(role: string): Promise<ISuperAdminDocument | null> {
    return await this.model.findOne({role})
  }
}


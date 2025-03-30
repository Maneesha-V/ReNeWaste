import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";
import { SuperAdminModel } from "../../models/superAdmin/superAdminModel";

export const findAdminByEmail = async (email:string): Promise<ISuperAdminDocument | null> => {
  return await SuperAdminModel.findOne({email}).exec();
};
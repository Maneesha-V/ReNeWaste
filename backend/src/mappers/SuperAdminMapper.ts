import { SuperAdminDTO } from "../dtos/superadmin/superadminDTO";
import { ISuperAdminDocument } from "../models/superAdmin/interfaces/superAdminInterface";

export class SuperAdminMapper {
static mapSuperAdminDTO(doc: ISuperAdminDocument): SuperAdminDTO {
    return {
      _id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      role: doc.role,
    };
  }
}
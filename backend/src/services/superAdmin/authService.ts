import bcrypt from "bcrypt";
import SuperAdminRepository from "../../repositories/superAdmin/superAdminRepository";
import { SuperAdminLoginRequest, SuperAdminLoginResponse } from "../../types/superAdmin/authTypes";
import { generateToken } from "../../utils/authUtils";
import { ISuperAdminAuthService } from "./interface/IAuthService";

class SuperAdminAuthService implements ISuperAdminAuthService {
  async adminLoginService({ email, password }: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    const admin = await SuperAdminRepository.findAdminByEmail(email);
    console.log("admin", admin);

    if (!admin) {
      throw new Error("Invalid email or password.");
    }
    
    const isPasswordValid = admin.password ? await bcrypt.compare(password, admin.password) : false;
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }
    
    const token = generateToken(admin._id.toString());
    console.log("token", token);

    return { admin, token };
  }
}

export default new SuperAdminAuthService();
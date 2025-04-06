import bcrypt from "bcrypt";
import SuperAdminRepository from "../../repositories/superAdmin/superAdminRepository";
import { SuperAdminLoginRequest, SuperAdminLoginResponse, SuperAdminSignupRequest, SuperAdminSignupResponse } from "../../types/superAdmin/authTypes";
import { generateToken } from "../../utils/authUtils";
import { ISuperAdminAuthService } from "./interface/IAuthService";
import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";

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

    return { admin, token };
  }
  async adminSignupService({ username, email, password}: SuperAdminSignupRequest): Promise<SuperAdminSignupResponse> {
    const existingAdmin  = await SuperAdminRepository.findAdminByEmail(email);
    if (existingAdmin ) {
      throw new Error("Email already exists. Please use a different email.");
    }
    const existingUsername = await SuperAdminRepository.findAdminByUsername(username)
    if (existingUsername ) {
      throw new Error("Username already exists.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const admin = await SuperAdminRepository.createAdmin({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });

    // const token = generateToken(admin._id.toString());
    // return { admin, token };
        const newAdmin: ISuperAdminDocument = await SuperAdminRepository.createAdmin(
          {
            username,
            email,
            password: hashedPassword,
          }
        );
        const token = generateToken(newAdmin._id.toString());
        return { admin: newAdmin, token };
  }
}

export default new SuperAdminAuthService();
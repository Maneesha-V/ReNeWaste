import bcrypt from "bcrypt";
import { findAdminByEmail } from "../../repositories/superAdmin/authRepository";
import { SuperAdminLoginRequest, SuperAdminLoginResponse } from "../../types/superAdmin/authTypes";
import { generateToken } from "../../utils/authUtils";

export const adminLoginService = async ({email, password}:SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> => {
  const admin = await findAdminByEmail(email);
  console.log("admin",admin);
  
  if (!admin) {
    throw new Error("Invalid email or password.");
  }
  const isPasswordValid = admin.password ? await bcrypt.compare(password, admin.password) : false;
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }
  const token = generateToken(admin._id.toString());
  console.log("token",token);
  
  return { admin, token };
};
import bcrypt from "bcrypt";
import SuperAdminRepository from "../../repositories/superAdmin/superAdminRepository";
import UserRepository from "../../repositories/user/userRepository";
import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSignupRequest,
  SuperAdminSignupResponse,
} from "../../types/superAdmin/authTypes";
import { generateToken } from "../../utils/authUtils";
import { ISuperAdminAuthService } from "./interface/IAuthService";
import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";
import { generateOtp } from "../../utils/otpUtils";
import { sendEmail } from "../../utils/mailerUtils";
import jwt from "jsonwebtoken";

class SuperAdminAuthService implements ISuperAdminAuthService {
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string, role:string };
      const admin = await SuperAdminRepository.getSuperAdminById(decoded.userId);
      if (!admin) {
        throw new Error("Admin not found");
      }
  
      const accessToken = jwt.sign(
        { userId: admin._id, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15min" }
      );
      return {  token: accessToken};

    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
  async adminLoginService({
    email,
    password,
  }: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    const admin = await SuperAdminRepository.findAdminByEmail(email);
    console.log("admin", admin);

    if (!admin) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = admin.password
      ? await bcrypt.compare(password, admin.password)
      : false;
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = generateToken({userId:admin._id.toString(),role:admin.role});
    return { admin, token };
  }
  async adminSignupService({
    username,
    email,
    password,
  }: SuperAdminSignupRequest): Promise<SuperAdminSignupResponse> {
    const existingAdmin = await SuperAdminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new Error("Email already exists. Please use a different email.");
    }
    const existingUsername = await SuperAdminRepository.findAdminByUsername(
      username
    );
    if (existingUsername) {
      throw new Error("Username already exists.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin: ISuperAdminDocument =
      await SuperAdminRepository.createAdmin({
        username,
        email,
        password: hashedPassword,
        role: "superadmin",
      });
    const token = generateToken({userId:newAdmin._id.toString(),role:newAdmin.role});
    return { admin: newAdmin, token };
  }
  async sendOtpService(email: string) {
    const superAdmin = await SuperAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new Error("Superadmin  not found.");
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await UserRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`
    );
    return { message: "OTP sent successfully", otp };
  }
  async resendOtpService(email: string) {
    const superAdmin = await SuperAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new Error("Superadmin not found.");
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await UserRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`
    );
    return { message: "Resend OTP sent successfully", otp };
  }
  async verifyOtpService(email: string, otp: string): Promise<boolean> {
    const storedOtp = await UserRepository.findOtpByEmail(email);
    if (!storedOtp || storedOtp.otp !== otp) return false;
    const createdAt = storedOtp.createdAt;
    if (!createdAt) {
      throw new Error("OTP creation date is missing.");
    }
    const otpAge =
      (new Date().getTime() - new Date(createdAt).getTime()) / 1000;
    if (otpAge > 30) {
      return false;
    }
    await UserRepository.deleteOtp(email);
    return true;
  }
  async resetPasswordService(
    email: string,
    newPassword: string
  ): Promise<void> {
    const superAdmin = await SuperAdminRepository.findAdminByEmail(email);
    if (!superAdmin) throw new Error("Superadmin not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await SuperAdminRepository.updateAdminPassword(email, hashedPassword);
  }
}

export default new SuperAdminAuthService();

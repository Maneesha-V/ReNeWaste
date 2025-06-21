import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
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
import TYPES from "../../config/inversify/types";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";


@injectable()
export class SuperAdminAuthService implements ISuperAdminAuthService {
    constructor(
    @inject(TYPES.SuperAdminRepository)
    private superAdminRepository: ISuperAdminRepository,

    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string, role:string };
      const admin = await this.superAdminRepository.getSuperAdminById(decoded.userId);
      if (!admin) {
        throw new Error("Admin not found");
      }
  
      const accessToken = jwt.sign(
        // { userId: admin._id, role: admin.role },
        { userId: decoded.userId, role: decoded.role },
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
    const admin = await this.superAdminRepository.findAdminByEmail(email);
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
    const existingAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new Error("Email already exists. Please use a different email.");
    }
    const existingUsername = await this.superAdminRepository.findAdminByUsername(
      username
    );
    if (existingUsername) {
      throw new Error("Username already exists.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin: ISuperAdminDocument =
      await this.superAdminRepository.createAdmin({
        username,
        email,
        password: hashedPassword,
        role: "superadmin",
      });
    const token = generateToken({userId:newAdmin._id.toString(),role:newAdmin.role});
    return { admin: newAdmin, token };
  }
  async sendOtpService(email: string) {
    const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new Error("Superadmin  not found.");
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await this.userRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`
    );
    return { message: "OTP sent successfully", otp };
  }
  async resendOtpService(email: string) {
    const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new Error("Superadmin not found.");
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await this.userRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`
    );
    return { message: "Resend OTP sent successfully", otp };
  }
  async verifyOtpService(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.userRepository.findOtpByEmail(email);
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
    await this.userRepository.deleteOtp(email);
    return true;
  }
  async resetPasswordService(
    email: string,
    newPassword: string
  ): Promise<void> {
    const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (!superAdmin) throw new Error("Superadmin not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.superAdminRepository.updateAdminPassword(email, hashedPassword);
  }
}



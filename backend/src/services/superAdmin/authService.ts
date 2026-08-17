import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/authUtils";
import { ISuperAdminAuthService } from "./interface/IAuthService";
import { ISuperAdminDocument } from "../../models/superAdmin/interfaces/superAdminInterface";
import { generateOtp } from "../../utils/otpUtils";
import { sendEmail } from "../../utils/mailerUtils";
import jwt from "jsonwebtoken";
import TYPES from "../../config/inversify/types";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { SuperAdminMapper } from "../../mappers/SuperAdminMapper";
import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSignupRequest,
} from "../../dtos/superadmin/superadminDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class SuperAdminAuthService implements ISuperAdminAuthService {
  constructor(
    @inject(TYPES.SuperAdminRepository)
    private superAdminRepository: ISuperAdminRepository,

    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}
  async verifyToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
      role: string;
    };
    const admin = await this.superAdminRepository.getSuperAdminById(
      decoded.userId,
    );
    if (!admin) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.NOT_FOUND,
      );
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15min" },
    );
    return { token: accessToken };
  }
  async adminLoginService({
    email,
    password,
  }: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    const admin = await this.superAdminRepository.findAdminByEmail(email);
    console.log("admin", admin);

    if (!admin) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.USER.ERROR.INVALID_PASS,
      );
    }

    const isPasswordValid = admin.password
      ? await bcrypt.compare(password, admin.password)
      : false;
    if (!isPasswordValid) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.USER.ERROR.INVALID_PASS,
      );
    }

    const token = generateToken({
      userId: admin._id.toString(),
      role: admin.role,
    });
    return { admin: SuperAdminMapper.mapSuperAdminDTO(admin), token };
  }
  async adminSignupService({
    username,
    email,
    password,
  }: SuperAdminSignupRequest): Promise<boolean> {
    const existingAdmin =
      await this.superAdminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.USER.ERROR.EMAIL_EXIST,
      );
    }
    const existingUsername =
      await this.superAdminRepository.findAdminByUsername(username);
    if (existingUsername) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.SUPERADMIN.ERROR.USERNAME_EXISTS,
      );
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

    if (!newAdmin) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.SUPERADMIN.ERROR.FAILED_ADMIN_CREATION,
      );
    }
    return true;
  }
  async sendOtpService(email: string): Promise<boolean> {
    const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.NOT_FOUND,
      );
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await this.userRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`,
    );
    return true;
  }
  async resendOtpService(email: string): Promise<boolean> {
    const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.NOT_FOUND,
      );
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await this.userRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`,
    );
    return true;
  }
  async verifyOtpService(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.userRepository.findOtpByEmail(email);
    if (!storedOtp || storedOtp.otp !== otp) return false;
    const createdAt = storedOtp.createdAt;
    if (!createdAt) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.OTP_DATE);
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
    newPassword: string,
  ): Promise<boolean> {
    const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
    if (!superAdmin) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.NOT_FOUND,
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await this.superAdminRepository.updateAdminPassword(
      email,
      hashedPassword,
    );
    return !!updated;
  }
}

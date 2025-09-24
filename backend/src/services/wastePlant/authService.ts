import { inject, injectable } from "inversify";
import { generateToken } from "../../utils/authUtils";
import { sendEmail } from "../../utils/mailerUtils";
import { generateOtp } from "../../utils/otpUtils";
import { IAuthService } from "./interface/IAuthService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { WastePlantMapper } from "../../mappers/WastePlantMapper";
import { LoginRequest } from "../../dtos/user/userDTO";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
  ) {}
  async verifyToken(token: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
        role: string;
      };
      console.log("Refresh token payload:", decoded);
      const wastePlant = await this.wastePlantRepository.getWastePlantById(
        decoded.userId,
      );
      console.log("wastePlant", wastePlant);

      if (!wastePlant) {
        throw new Error("Wasteplant not found");
      }

      const accessToken = jwt.sign(
        { userId: wastePlant._id, role: wastePlant.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15min" },
      );
      return { token: accessToken };
    } catch (error) {
      console.error("Refresh token error", error);
      throw new Error("Invalid or expired refresh token");
    }
  }
  async loginWastePlant({ email, password }: LoginRequest) {
    const wastePlant =
      await this.wastePlantRepository.findWastePlantByEmail(email);

    if (
      !wastePlant ||
      !(await bcrypt.compare(password, wastePlant.password || ""))
    ) {
      throw new Error("Invalid email or password.");
    }

    if (wastePlant?.isBlocked) {
      throw new Error("Your account has been blocked by the superadmin.");
    }
    const token = generateToken({
      userId: wastePlant._id.toString(),
      role: wastePlant.role,
    });
    return { wastePlant: WastePlantMapper.mapWastePlantDTO(wastePlant), token };
  }
  async sendOtpService(email: string) {
    const wastePlant =
      await this.wastePlantRepository.findWastePlantByEmail(email);
    if (!wastePlant) {
      throw new Error("Wasteplant not found.");
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await this.wastePlantRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`,
    );
    return otp;
  }
  async resendOtpService(email: string) {
    const wastePlant =
      await this.wastePlantRepository.findWastePlantByEmail(email);
    if (!wastePlant) {
      throw new Error("User not found.");
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await this.wastePlantRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`,
    );
    return otp;
  }
  async verifyOtpService(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.wastePlantRepository.findOtpByEmail(email);
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
    await this.wastePlantRepository.deleteOtp(email);
    return true;
  }
  async resetPasswordService(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const wastePlant =
      await this.wastePlantRepository.findWastePlantByEmail(email);
    if (!wastePlant) throw new Error("User not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.wastePlantRepository.updateWastePlantPassword(
      email,
      hashedPassword,
    );
  }
}

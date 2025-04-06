import WastePlantRepository from "../../repositories/wastePlant/wastePlantRepository";
import { LoginRequest, LoginResponse } from "../../types/wastePlant/authTypes";
import { generateToken } from "../../utils/authUtils";
import { sendEmail } from "../../utils/mailerUtils";
import { generateOtp } from "../../utils/otpUtils";
import { IAuthService } from "./interface/IAuthService";
import bcrypt from "bcrypt";

class AuthService implements IAuthService {
  async loginWastePlant({
    email,
    password,
  }: LoginRequest): Promise<LoginResponse> {
    const wastePlant = await WastePlantRepository.findWastePlantByEmail(email);

    if (
      !wastePlant ||
      !(await bcrypt.compare(password, wastePlant.password || ""))
    ) {
      throw new Error("Invalid email or password.");
    }
    const token = generateToken(wastePlant._id.toString());
    return { wastePlant, token };
  }
  async sendOtpService(email: string) {
    const wastePlant = await WastePlantRepository.findWastePlantByEmail(email);
    if (!wastePlant) {
      throw new Error("Wasteplant not found.");
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await WastePlantRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`
    );
    return { message: "OTP sent successfully", otp };
  }
    async resendOtpService(email: string) {
      const wastePlant = await WastePlantRepository.findWastePlantByEmail(email);
      if (!wastePlant) {
        throw new Error("User not found.");
      }
      const otp = generateOtp();
      console.log(`Resend OTP for ${email}:`, otp);
      await WastePlantRepository.reSaveOtp(email, otp);
      await sendEmail(
        email,
        "Your Resend OTP Code",
        `Your Resend OTP code is: ${otp}. It will expire in 30s.`
      );
      return { message: "Resend OTP sent successfully", otp };
    }
  
    async verifyOtpService(email: string, otp: string): Promise<boolean> {
      const storedOtp = await WastePlantRepository.findOtpByEmail(email);
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
      await WastePlantRepository.deleteOtp(email);
      return true;
    }
  
    async resetPasswordService(
      email: string,
      newPassword: string
    ): Promise<void> {
      const wastePlant = await WastePlantRepository.findWastePlantByEmail(email);
      if (!wastePlant) throw new Error("User not found");
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await WastePlantRepository.updateWastePlantPassword(email, hashedPassword);
    }
}
export default new AuthService();

import DriverRepository from "../../repositories/driver/driverRepository";
import UserRepository from "../../repositories/user/userRepository";
import { LoginRequest, LoginResponse } from "../../types/driver/authTypes";
import { generateToken } from "../../utils/authUtils";
import { sendEmail } from "../../utils/mailerUtils";
import { generateOtp } from "../../utils/otpUtils";
import { IAuthService } from "./interface/IAuthService";
import bcrypt from "bcrypt";

class AuthService implements IAuthService {
  async loginDriver({ email, password }: LoginRequest): Promise<LoginResponse> {
    const driver = await DriverRepository.findDriverByEmail(email);

    if (!driver || !(await bcrypt.compare(password, driver.password || ""))) {
      throw new Error("Invalid email or password.");
    }
    const token = generateToken(driver._id.toString());
    return { driver, token };
  }
  async sendOtpService(email: string) {
    const driver = await DriverRepository.findDriverByEmail(email);
    if (!driver) {
      throw new Error("Driver not found.");
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
    const driver = await DriverRepository.findDriverByEmail(email);
    if (!driver) {
      throw new Error("Driver not found.");
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
    const driver = await DriverRepository.findDriverByEmail(email);
    if (!driver) throw new Error("Driver not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await DriverRepository.updateDriverPassword(email, hashedPassword);
  }
}
export default new AuthService();

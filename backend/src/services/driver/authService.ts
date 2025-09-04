import { inject, injectable } from "inversify";
import { generateToken } from "../../utils/authUtils";
import { sendEmail } from "../../utils/mailerUtils";
import { generateOtp } from "../../utils/otpUtils";
import { IAuthService } from "./interface/IAuthService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { LoginRequest, LoginResponse } from "../../dtos/driver/driverDTO";
import { DriverMapper } from "../../mappers/DriverMapper";

@injectable()
export class AuthService implements IAuthService {
    private driverRepository: IDriverRepository;

  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.DriverRepositoryFactory)
    getDriverRepo: () => IDriverRepository
  ) {
    this.driverRepository = getDriverRepo(); 
  }
  async verifyToken(token: string): Promise<{ token: string }> {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
        role: string;
      };
      const driver = await this.driverRepository.getDriverById(decoded.userId);

      if (!driver) {
        throw new Error("Driver not found");
      }
     
      const accessToken = jwt.sign(
        { userId: driver._id, role: driver.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15min" }
      );

      return { token: accessToken };
  }
  async loginDriver({ email, password }: LoginRequest): Promise<LoginResponse> {
    const driver = await this.driverRepository.findDriverByEmail(email);

    if (!driver || !(await bcrypt.compare(password, driver.password || ""))) {
      throw new Error("Invalid email or password.");
    }
    const token = generateToken({
      userId: driver._id.toString(),
      role: driver.role,
    });
    return { 
      driver: DriverMapper.mapDriverDTO(driver), 
      token 
    };
  }
  async sendOtpService(email: string) {
    const driver = await this.driverRepository.findDriverByEmail(email);
    if (!driver) {
      throw new Error("Driver not found.");
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await this.userRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`
    );
    return otp;
  }
  async resendOtpService(email: string) {
    const driver = await this.driverRepository.findDriverByEmail(email);
    if (!driver) {
      throw new Error("Driver not found.");
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await this.userRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`
    );
    return otp;
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
    const driver = await this.driverRepository.findDriverByEmail(email);
    if (!driver) throw new Error("Driver not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.driverRepository.updateDriverPassword(email, hashedPassword);
  }
}


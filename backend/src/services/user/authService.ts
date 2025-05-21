import bcrypt from "bcrypt";
import {
  IUser,
  IUserDocument,
} from "../../models/user/interfaces/userInterface";
import { generateToken } from "../../utils/authUtils";
import {
  SignupResponse,
  LoginRequest,
  LoginResponse,
  GoogleLoginReq,
  GoogleLoginResp,
} from "../../types/user/authTypes";
import { generateOtp } from "../../utils/otpUtils";
import { sendEmail } from "../../utils/mailerUtils";
import { IAuthService } from "./interface/IAuthService";
import { Types } from "mongoose";
import { IAddressDocument } from "../../models/user/interfaces/addressInterface";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ){}
  async verifyToken(token: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
        role: string;
      };
      const user = await this.userRepository.findUserById(decoded.userId);
      if (!user) {
        throw new Error("USer not found");
      }

      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15min" }
      );
      return { token: accessToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
  async signupUser(userData: IUser): Promise<SignupResponse> {
    const existingUser = await this.userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists. Please use a different email.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, salt)
      : undefined;

    const newUserData: IUser = {
      ...userData,
      password: hashedPassword,
      addresses: userData.addresses || [],
    };
    if (userData.googleId) {
      newUserData.googleId = userData.googleId;
    }
    const newUser: IUserDocument = await this.userRepository.createUser(newUserData);
    const token = generateToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });
    return { user: newUser, token };
  }

  async loginUser({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password || ""))) {
      throw new Error("Invalid email or password.");
    }
    if (user.isBlocked) {
      throw new Error("Your account has been blocked by the waste plant.");
    }
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });
    return { user, token };
  }
  async sendOtpSignupService(email: string) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists.");
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
  async resendOtpSignupService(email: string) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists.");
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
  async verifyOtpSignupService(email: string, otp: string): Promise<boolean> {
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
  async sendOtpService(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
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
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
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
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updateUserPassword(email, hashedPassword);
  }

  async googleSignUpService(
    email: string,
    displayName: string,
    uid: string
  ): Promise<{ user: IUserDocument; token: string }> {
    let user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      user = await this.userRepository.createUser({
        firstName: displayName.split(" ")[0] || "",
        lastName: displayName.split(" ")[1] || "",
        email,
        password: undefined,
        agreeToTerms: true,
        role: "user",
        phone: undefined,
        googleId: uid,
        addresses: [] as unknown as Types.DocumentArray<IAddressDocument>,
        isBlocked: false,
      });
    }
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });
    return { user, token };
  }

  async googleLoginService({
    email,
    googleId,
  }: GoogleLoginReq): Promise<GoogleLoginResp> {
    const user = await this.userRepository.findUserByEmailGoogleId(email, googleId);
    if (!user) {
      throw new Error("User could not be created or found");
    }

    if (user.isBlocked) {
      throw new Error("Your account has been blocked.");
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return { user, token };
  }
}


import bcrypt from "bcrypt";
import {
  IUser,
  IUserDocument,
} from "../../models/user/interfaces/userInterface";
import UserRepository from "../../repositories/user/userRepository";
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

class AuthService implements IAuthService {
  async signupUser(userData: IUser): Promise<SignupResponse> {
    const existingUser = await UserRepository.findUserByEmail(userData.email);
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
      // googleId: userData.googleId || null,
      addresses: userData.addresses || [],
    };
    if (userData.googleId) {
      newUserData.googleId = userData.googleId;
    }
    const newUser: IUserDocument = await UserRepository.createUser(newUserData);
    const token = generateToken(newUser._id.toString());
    return { user: newUser, token };
  }

  async loginUser({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password || ""))) {
      throw new Error("Invalid email or password.");
    }
    const token = generateToken(user._id.toString());
    return { user, token };
  }

  async sendOtpService(email: string) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
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
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
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
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.updateUserPassword(email, hashedPassword);
  }

  async googleSignUpService(
    email: string,
    displayName: string,
    uid: string
  ): Promise<{ user: IUserDocument; token: string }> {
    let user = await UserRepository.findUserByEmail(email);
    if (!user) {
      user = await UserRepository.createUser({
        firstName: displayName.split(" ")[0] || "",
        lastName: displayName.split(" ")[1] || "",
        email,
        password: undefined,
        agreeToTerms: true,
        role: "user",
        phone: undefined,
        googleId: uid,
        addresses: [],
      });
    }
    const token = generateToken(user._id.toString());
    return { user, token };
  }

  async googleLoginService({
    email,
    googleId,
  }: GoogleLoginReq): Promise<GoogleLoginResp> {
    const user = await UserRepository.findUserByEmailGoogleId(email, googleId);
    if (!user) throw new Error("User could not be created or found");
    return { user, token: generateToken(user._id.toString()) };
  }
}

export default new AuthService();

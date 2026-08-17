import bcrypt from "bcrypt";
import {
  IUser,
  IUserDocument,
} from "../../models/user/interfaces/userInterface";
import { generateToken } from "../../utils/authUtils";
import { generateOtp } from "../../utils/otpUtils";
import { sendEmail } from "../../utils/mailerUtils";
import { IAuthService } from "./interface/IAuthService";
import { Types } from "mongoose";
import { IAddressDocument } from "../../models/user/interfaces/addressInterface";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { UserMapper } from "../../mappers/UserMapper";
import {
  GoogleLoginReq,
  GoogleLoginResp,
  GoogleSignUpReq,
  GoogleSignUpResp,
  LoginRequest,
  LoginResponse,
  SignupResponse,
} from "../../dtos/user/userDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
  ) {}
  async verifyToken(token: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
        role: string;
      };
      const user = await this._userRepository.findUserById(decoded.userId);
      if (!user) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.USER.ERROR.NOT_FOUND,
        );
      }

      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15min" },
      );
      return { token: accessToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
  async signupUser(userData: IUser): Promise<SignupResponse> {
    const email = userData.email.trim();
    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.USER.ERROR.EMAIL_EXIST,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, salt)
      : undefined;

    const newUserData: IUser = {
      ...userData,
      email,
      password: hashedPassword,
      addresses: userData.addresses || [],
    };
    if (userData.googleId) {
      newUserData.googleId = userData.googleId;
    }
    const newUser: IUserDocument =
      await this._userRepository.createUser(newUserData);
    const token = generateToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });
    return { user: UserMapper.mapUserLoginDTO(newUser), token };
  }

  async loginUser({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
       throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.USER.ERROR.INVALID_PASS,
      );
    }
    if (!(await bcrypt.compare(password, user.password || ""))) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.USER.ERROR.INVALID_PASS,
      );
    }
    if (user.isBlocked) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        MESSAGES.USER.ERROR.ACCOUNT_BLOCK,
      );
    }
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });
    return { user: UserMapper.mapUserLoginDTO(user), token };
  }
  async sendOtpSignupService(email: string): Promise<boolean> {
    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.USER.ERROR.EMAIL_EXIST,
      );
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await this._userRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`,
    );
    return true;
  }
  async resendOtpSignupService(email: string): Promise<boolean> {
    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.USER.ERROR.EMAIL_EXIST,
      );
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await this._userRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`,
    );
    return true;
  }
  async verifyOtpSignupService(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this._userRepository.findOtpByEmail(email);
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
    await this._userRepository.deleteOtp(email);
    return true;
  }
  async sendOtpService(email: string): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}:`, otp);
    await this._userRepository.saveOtp(email, otp);
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is: ${otp}. It will expire in 30s.`,
    );
  }
  async resendOtpService(email: string): Promise<boolean> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    const otp = generateOtp();
    console.log(`Resend OTP for ${email}:`, otp);
    await this._userRepository.reSaveOtp(email, otp);
    await sendEmail(
      email,
      "Your Resend OTP Code",
      `Your Resend OTP code is: ${otp}. It will expire in 30s.`,
    );
    return true;
  }
  async verifyOtpService(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this._userRepository.findOtpByEmail(email);
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
    await this._userRepository.deleteOtp(email);
    return true;
  }
  async resetPasswordService(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updateUserPassword(email, hashedPassword);
  }

  async googleSignUpService({
    email,
    displayName,
    uid,
  }: GoogleSignUpReq): Promise<GoogleSignUpResp> {
    let user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      user = await this._userRepository.createUser({
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
    return { role: user.role, token };
  }

  async googleLoginService({
    email,
    googleId,
  }: GoogleLoginReq): Promise<GoogleLoginResp> {
    const user = await this._userRepository.findUserByEmailGoogleId(
      email,
      googleId,
    );
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        MESSAGES.USER.ERROR.ACCOUNT_BLOCK,
      );
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return { role: user.role, token, userId: user._id.toString() };
  }
}

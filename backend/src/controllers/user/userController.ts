import { Request, Response } from "express";
import { IUserController } from "./interface/IUserController";
import { generateRefreshToken } from "../../utils/authUtils";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IAuthService } from "../../services/user/interface/IAuthService";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserAuthService)
    private authService: IAuthService
  ){}
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      console.log("refreshToken", refreshToken);

      if (!refreshToken) {
        res.status(401).json({ error: "No refresh token provided." });
        return;
      }
      const { token } = await this.authService.verifyToken(refreshToken);
      res.status(200).json({ token });
    } catch (error: any) {
      console.error("err", error);
      res.status(401).json({ error: error.message });
    }
  }
  async signup(req: Request, res: Response): Promise<void> {
    console.log("body", req.body);
    try {
      const userData = req.body;
      console.log("userData", userData);
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      const { confirmPassword, ...userWithoutConfirm } = userData;

      const { user, token } = await this.authService.signupUser(userWithoutConfirm);
      console.log("user", user);

      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      console.log("err", error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      const { user, token } = await this.authService.loginUser({ email, password });
      const { password: _, ...safeUser } = user.toObject();
      const refreshToken = await generateRefreshToken({
        userId: user._id.toString(),
        role: user.role,
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res.cookie("refreshToken", refreshToken, cookieOptions).status(200).json({
        success: true,
        message: "Login successful",
        role: safeUser.role,
        userId: safeUser._id,
        token,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };

      res.clearCookie("refreshToken", cookieOptions);
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }

  async sendOtpForSignup(req: Request, res: Response): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;

      const otpResponse = await this.authService.sendOtpSignupService(email);

      res.status(200).json(otpResponse);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
  async resendOtpForSignup(req: Request, res: Response): Promise<void> {
    console.log("body", req.body);
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: "Email is required" });
      }

      const success = await this.authService.resendOtpSignupService(email);
      if (success) {
        res.status(200).json({ message: "OTP resent successfully" });
      } else {
        res.status(500).json({ error: "Failed to resend OTP" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error, please try again later" });
    }
  }
  async verifyOtpForSignup(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res.status(400).json({ error: "Email and OTP are required" });
        return;
      }

      const isValid = await this.authService.verifyOtpSignupService(email, otp);

      if (!isValid) {
        res.status(400).json({ error: "Invalid or expired OTP" });
        return;
      }

      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;

      const otpResponse = await this.authService.sendOtpService(email);

      res.status(200).json(otpResponse);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
  async resendOtp(req: Request, res: Response): Promise<void> {
    console.log("body", req.body);
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: "Email is required" });
      }

      const success = await this.authService.resendOtpService(email);
      if (success) {
        res.status(200).json({ message: "OTP resent successfully" });
      } else {
        res.status(500).json({ error: "Failed to resend OTP" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error, please try again later" });
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(req.body);

      if (!email || !otp) {
        res.status(400).json({ error: "Email and OTP are required" });
        return;
      }

      const isValid = await this.authService.verifyOtpService(email, otp);

      if (!isValid) {
        res.status(400).json({ error: "Invalid or expired OTP" });
        return;
      }

      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }
      await this.authService.resetPasswordService(email, password);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async googleSignUp(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, displayName, uid } = req.body;
      if (!email || !uid) {
        res.status(400).json({ message: "Email and UID are required" });
        return;
      }
      const { user, token } = await this.authService.googleSignUpService(
        email,
        displayName,
        uid
      );
      res
        .status(200)
        .json({ message: "User signed in successfully", user, token });
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, googleId } = req.body;
      const response = await this.authService.googleLoginService({
        email,
        googleId
      });
      const { user, token } = response;
        const refreshToken = await generateRefreshToken({
        userId: user._id.toString(),
        role: user.role,
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res.cookie("refreshToken", refreshToken, cookieOptions).status(200).json({
        success: true,
        message: "Login successful",
        user,
        token,
      });

    } catch (error: any) {
      console.error("Google login error:", error);
      res
        .status(500)
        .json({
          message: error.message || "Something went wrong during login",
        });
    }
  }
}


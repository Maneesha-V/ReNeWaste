import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthController } from "./interface/IAuthController";
import { generateRefreshToken } from "../../utils/authUtils";
import { AuthRequest } from "../../types/common/middTypes";
import TYPES from "../../config/inversify/types";
import { IAuthService } from "../../services/driver/interface/IAuthService";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.DriverAuthService)
    private authService: IAuthService
  ){}
   async refreshToken(req: AuthRequest, res: Response): Promise<void> {
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
  async driverLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      const { driver, token } = await this.authService.loginDriver({
        email,
        password,
      });
           const { password: _, ...safeDriver } = driver.toObject();
            const refreshToken = await generateRefreshToken({
              userId: driver._id.toString(),
              role: driver.role,
            });
      
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
              httpOnly: true,
              secure: isProduction,
              // sameSite: "strict" as "strict",
              sameSite: isProduction ? 'none' as const : 'lax' as const,
              path: "/api/driver",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            };
            res.cookie("refreshToken", refreshToken, cookieOptions).status(200).json({
              success: true,
              message: "Login successful",
              category: safeDriver.category,
              role: safeDriver.role,
              driverId: safeDriver._id,
              token,
            });
      // res.status(200).json({ driver, token });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }
  async driverLogout(req: Request, res: Response): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
        path: "/api/driver"
      };

      res.clearCookie("refreshToken", cookieOptions);
      res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Logout failed. Please try again." });
    }
  }
  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("otp-body-driver", req.body);
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
}


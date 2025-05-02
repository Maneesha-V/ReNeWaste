import { Request, Response } from "express";
import SuperAdminAuthService from "../../services/superAdmin/authService";
import { IAuthController } from "./interface/IAuthController";
import { generateRefreshToken } from "../../utils/authUtils";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import jwt from "jsonwebtoken";

class AuthController implements IAuthController {
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      console.log("refreshToken",refreshToken);
      
      if (!refreshToken) {
         res.status(401).json({ error: "No refresh token provided." });
         return;
      }
      const {token} = await SuperAdminAuthService.verifyToken(refreshToken)
      res.status(200).json({ token });
    } catch (error: any) {
      console.error("err", error);
      res.status(401).json({ error: error.message });
    }
  }
  async superAdminLogin(req: Request, res: Response): Promise<void> {
    try {
      
      const { email, password } = req.body;
      const { admin, token } = await SuperAdminAuthService.adminLoginService({
        email,
        password,
      });
      const { password: _, ...safeAdmin } = admin.toObject();

      const refreshToken = await generateRefreshToken({userId: admin._id.toString(), role: admin.role})
  
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      };
      res
      .cookie("refreshToken", refreshToken,  cookieOptions )  
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        admin: safeAdmin,
        token
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }
  async superAdminSignup(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);

      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }
      const { admin, token } = await SuperAdminAuthService.adminSignupService({
        username,
        email,
        password,
      });
      res.status(200).json({ admin, token });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }
  async superAdminLogout(req: Request, res: Response): Promise<void> {
    try {
      // res.clearCookie("token", {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "strict",
      // });
      // res.status(200).json({ message: "Logout successful" });
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
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }
  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;

      const otpResponse = await SuperAdminAuthService.sendOtpService(email);

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

      const success = await SuperAdminAuthService.resendOtpService(email);
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

      const isValid = await SuperAdminAuthService.verifyOtpService(email, otp);

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
      await SuperAdminAuthService.resetPasswordService(email, password);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
export default new AuthController();

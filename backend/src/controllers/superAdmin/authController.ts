import { Request, Response } from "express";
import SuperAdminAuthService from "../../services/superAdmin/authService";
import { IAuthController } from "./interface/IAuthController";

class AuthController implements IAuthController {
  async superAdminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { admin, token } = await SuperAdminAuthService.adminLoginService({
        email,
        password,
      });
      res.status(200).json({ admin, token });
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
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      res.status(500).json({ error: "Logout failed. Please try again." });
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

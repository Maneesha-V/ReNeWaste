import { Request, Response } from "express";
import AuthService from "../../services/user/authService";
import { IUserController } from "./interface/IUserController";

class UserController implements IUserController {
  async signup(req: Request, res: Response): Promise<void> {
    console.log("body", req.body);
    try {
      const userData = req.body;
      const { user, token } = await AuthService.signupUser(userData);
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
      const { user, token } = await AuthService.loginUser({ email, password });
      res.status(200).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
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

  async sendOtpForSignup(req: Request, res: Response): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;
      
      const otpResponse = await AuthService.sendOtpSignupService(email);

      res.status(200).json(otpResponse);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: error.message || "Internal Server Error"});
    }
  }
  async resendOtpForSignup(req: Request, res: Response): Promise<void> {
    console.log("body",req.body);
    try {
      const { email } = req.body;
      if (!email) {
         res.status(400).json({ error: "Email is required" });
      }
  
      const success = await AuthService.resendOtpSignupService(email);
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

      const isValid = await AuthService.verifyOtpSignupService(email, otp);

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
      
      const otpResponse = await AuthService.sendOtpService(email);

      res.status(200).json(otpResponse);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: error.message || "Internal Server Error"});
    }
  }
  async resendOtp(req: Request, res: Response): Promise<void> {
    console.log("body",req.body);
    try {
      const { email } = req.body;
      if (!email) {
         res.status(400).json({ error: "Email is required" });
      }
  
      const success = await AuthService.resendOtpService(email);
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

      const isValid = await AuthService.verifyOtpService(email, otp);

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
      await AuthService.resetPasswordService(email, password);
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
      const { user, token } = await AuthService.googleSignUpService(email, displayName, uid);
      res.status(200).json({ message: "User signed in successfully", user, token });
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, googleId, token } = req.body;
      const response = await AuthService.googleLoginService({ email, googleId, token });
      console.log("res", response);
      res.status(200).json(response);
    } catch (error: any) {
      console.error("Google login error:", error);
      res.status(500).json({ message: error.message || "Something went wrong during login" });
    }
  }
}

export default new UserController();

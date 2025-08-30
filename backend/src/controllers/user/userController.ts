import { NextFunction, Request, Response } from "express";
import { IUserController } from "./interface/IUserController";
import { generateRefreshToken } from "../../utils/authUtils";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IAuthService } from "../../services/user/interface/IAuthService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserAuthService)
    private _authService: IAuthService
  ) {}
  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      console.log("refreshToken", refreshToken);

      if (!refreshToken) {
        // res.status(STATUS_CODES.UNAUTHORIZED).json({ error: MESSAGES.COMMON.ERROR.REFRESH_TOKEN });
        // return;
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.COMMON.ERROR.REFRESH_TOKEN)
      }
      const { token } = await this._authService.verifyToken(refreshToken);
      res.status(STATUS_CODES.SUCCESS).json({ token });
    } catch (error) {
      console.error("err", error);
      // res.status(401).json({ error: error.message });
      next(error);
    }
  }
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("body", req.body);
    try {
      const userData = req.body;
      console.log("userData", userData);
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      const { confirmPassword, ...userWithoutConfirm } = userData;

      const { user, token } = await this._authService.signupUser(
        userWithoutConfirm
      );
      console.log("user", user);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.SIGNUP,
        // role: user.role,
        // userId: user._id,
        // token,
      });
    } catch (error) {
      console.log("err", error);
      next(error);
    }
  }

  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this._authService.loginUser({
        email,
        password,
      });

      const refreshToken = await generateRefreshToken({
        userId: user._id,
        role: user.role,
      });
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res.cookie("refreshToken", refreshToken, cookieOptions).status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.LOGIN,
        role: user.role,
        userId: user._id,
        token,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async logout(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api",
      };

      res.clearCookie("refreshToken", cookieOptions);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.LOGOUT });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async sendOtpForSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;

      const otpResponse = await this._authService.sendOtpSignupService(email);
      if (!otpResponse) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.OTP_SENT
        );
      }

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
    } catch (error) {
      console.error("Error sending OTP:", error);
      // res.status(500).json({ error: error.message || "Internal Server Error" });
      next(error);
    }
  }
  async resendOtpForSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("body", req.body);
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_NOT_FOUND
        );
      }

      const success = await this._authService.resendOtpSignupService(email);
      if (success) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.COMMON.ERROR.RESENT_OTP });
      }
    } catch (error) {
      // res.status(500).json({ error: "Server error, please try again later" });
      next(error);
    }
  }
  async verifyOtpForSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        // res
        //   .status(STATUS_CODES.NOT_FOUND)
        //   .json({ error: MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED });
        // return;
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED
        )
      }

      const isValid = await this._authService.verifyOtpSignupService(
        email,
        otp
      );

      if (isValid) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_VERIFIED });
      } else {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.COMMON.ERROR.INVALID_EXPIRED_OTP });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      next(error);
    }
  }
  async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;

      await this._authService.sendOtpService(email);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
    } catch (error) {
      console.error("Error sending OTP:", error);
      next(error);
    }
  }
  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("body", req.body);
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_NOT_FOUND
        );
      }

      const success = await this._authService.resendOtpService(email);
      console.log("success", success);

      if (success) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
      } else {
        throw new ApiError(
          STATUS_CODES.SERVER_ERROR,
          MESSAGES.COMMON.ERROR.FAILED_OTP
        );
      }
    } catch (error) {
      next(error);
    }
  }
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(req.body);

      if (!email || !otp) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ error: MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED });
        return;
      }

      const isValid = await this._authService.verifyOtpService(email, otp);

      if (!isValid) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.INVALID_EXPIRED_OTP
        );
      }

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.OTP_VERIFIED });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      next(error);
    }
  }
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_PASSWORD_REQUIRED
        );
      }
      await this._authService.resetPasswordService(email, password);
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.PASSWORD_RESET });
    } catch (error) {
      console.error(error);
      next(error);
      // res.status(500).json({ message: "Server error" });
    }
  }

  async googleSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, displayName, uid } = req.body;
      if (!email || !uid) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_UID_REQUIRED
        );
        // res.status(400).json({ message: "Email and UID are required" });
        // return;
      }
      const { role, token } = await this._authService.googleSignUpService({
        email,
        displayName,
        uid,
      });
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.SIGNUP, role, token });
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      next(error);
    }
  }

  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, googleId } = req.body;
      const response = await this._authService.googleLoginService({
        email,
        googleId,
      });
      const { role, token, userId } = response;
      const refreshToken = await generateRefreshToken({
        userId: userId,
        role: role,
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res.cookie("refreshToken", refreshToken, cookieOptions).status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Google signin successful",
        role,
        token,
      });
    } catch (error) {
      console.error("Google login error:", error);
      next(error);
      // res.status(500).json({
      //   message: error.message || "Something went wrong during login",
      // });
    }
  }
}

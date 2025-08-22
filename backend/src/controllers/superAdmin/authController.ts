import { NextFunction, Request, Response } from "express";
import { IAuthController } from "./interface/IAuthController";
import { generateRefreshToken } from "../../utils/authUtils";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import TYPES from "../../config/inversify/types";
import { inject, injectable } from "inversify";
import { ISuperAdminAuthService } from "../../services/superAdmin/interface/IAuthService";
import { ApiError } from "../../utils/ApiError";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.SuperAdminAuthService)
    private _authService: ISuperAdminAuthService
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
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.REFRESH_TOKEN
        );
      }
      const { token } = await this._authService.verifyToken(refreshToken);

      res.status(STATUS_CODES.SUCCESS).json({ token });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async superAdminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const { admin, token } = await this._authService.adminLoginService({
        email,
        password,
      });
      if (!admin) {
        // res.status(401).json({ success: false, message: "Invalid credentials" });
        // return;
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.INVALID_CREDENTIALS
        );
      }
      console.log("admin", admin);

      // const { password: _, ...safeAdmin } = admin.toObject();

      const refreshToken = await generateRefreshToken({
        userId: admin._id.toString(),
        role: admin.role,
      });
      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api/super-admin",
        // sameSite: "strict" as "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.COMMON.SUCCESS.LOGIN,
          role: admin.role,
          adminId: admin._id,
          token,
        });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async superAdminSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS
        );
      }
      const created = await this._authService.adminSignupService({
        username,
        email,
        password,
      });

      if (created) {
        res
          .status(STATUS_CODES.CREATED)
          .json({ message: MESSAGES.COMMON.SUCCESS.SIGNUP });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.COMMON.ERROR.SIGNUP });
      }
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async superAdminLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        // sameSite: "strict" as const,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api/super-admin",
      };

      res.clearCookie("refreshToken", cookieOptions);
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.LOGOUT });
    } catch (error) {
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

      const otpResponse = await this._authService.sendOtpService(email);
      if (otpResponse) {
        res
          .status(STATUS_CODES.CREATED)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.COMMON.ERROR.FAILED_OTP });
      }
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

      if (!email || !otp) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED
        );
      }

      const isValid = await this._authService.verifyOtpService(email, otp);

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
    }
  }
}

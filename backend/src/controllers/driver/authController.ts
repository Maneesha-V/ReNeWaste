import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { IAuthController } from "./interface/IAuthController";
import { generateRefreshToken } from "../../utils/authUtils";
import TYPES from "../../config/inversify/types";
import { IAuthService } from "../../services/driver/interface/IAuthService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.DriverAuthService)
    private authService: IAuthService,
  ) {}
  async refreshToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      console.log("refreshToken", refreshToken);

      if (!refreshToken) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.REFRESH_TOKEN,
        );
      }
      const { token } = await this.authService.verifyToken(refreshToken);
      res.status(STATUS_CODES.SUCCESS).json({ token });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async driverLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      const { driver, token } = await this.authService.loginDriver({
        email,
        password,
      });
      //  const { password: _, ...safeDriver } = driver.toObject();
      const refreshToken = await generateRefreshToken({
        userId: driver._id.toString(),
        role: driver.role,
      });

      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        // sameSite: "strict" as "strict",
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api/driver",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.COMMON.SUCCESS.LOGIN,
          category: driver.category,
          role: driver.role,
          driverId: driver._id,
          token,
        });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async driverLogout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api/driver",
      };

      res.clearCookie("refreshToken", cookieOptions);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.LOGOUT,
      });
    } catch (error) {
      next(error);
    }
  }
  async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("otp-body-driver", req.body);
      const { email } = req.body;

      const otpResponse = await this.authService.sendOtpService(email);
      if (otpResponse) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.COMMON.ERROR.OTP_SENT });
      }
      res.status(STATUS_CODES.SUCCESS).json(otpResponse);
    } catch (error) {
      console.error("Error sending OTP:", error);
      next(error);
    }
  }
  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    console.log("body", req.body);
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_NOT_FOUND,
        );
      }

      const success = await this.authService.resendOtpService(email);
      if (success) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
      } else {
        throw new ApiError(
          STATUS_CODES.SERVER_ERROR,
          MESSAGES.COMMON.ERROR.FAILED_OTP,
        );
      }
    } catch (error) {
      next(error);
    }
  }
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED,
        );
      }

      const isValid = await this.authService.verifyOtpService(email, otp);

      if (!isValid) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.INVALID_EXPIRED_OTP,
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
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.EMAIL_PASSWORD_REQUIRED,
        );
      }
      await this.authService.resetPasswordService(email, password);
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.PASSWORD_RESET });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

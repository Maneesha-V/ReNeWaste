import { NextFunction, Request, Response } from "express";
import { IAuthController } from "./interface/IAuthController";
import { generateRefreshToken } from "../../utils/authUtils";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IAuthService } from "../../services/wastePlant/interface/IAuthService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.PlantAuthService)
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
  async wastePlantLogin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      const { wastePlant, token } = await this._authService.loginWastePlant({
        email,
        password,
      });
      // const { password: _, ...safeWastePlant } = wastePlant.toObject();
      console.log("wastePlant", wastePlant);

      const refreshToken = await generateRefreshToken({
        userId: wastePlant._id.toString(),
        role: wastePlant.role,
      });

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/api/waste-plant",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(STATUS_CODES.SUCCESS)
        .json({
          success: true,
          message: MESSAGES.COMMON.SUCCESS.LOGIN,
          role: wastePlant.role,
          plantId: wastePlant._id,
          token,
          status: wastePlant.status,
        });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async wastePlantLogout(
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
        path: "/api/waste-plant",
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
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("otp-body", req.body);
      const { email } = req.body;

      const otpResponse = await this._authService.sendOtpService(email);
      if (otpResponse) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.COMMON.SUCCESS.OTP_SENT });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.COMMON.ERROR.OTP_SENT });
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
    }
  }
}

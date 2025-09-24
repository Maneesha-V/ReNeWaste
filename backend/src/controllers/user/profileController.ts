import { NextFunction, Request, Response } from "express";
import { IProfileController } from "./interface/IProfileController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IProfileService } from "../../services/user/interface/IProfileService";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.UserProfileService)
    private profileService: IProfileService,
  ) {}
  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const user = await this.profileService.getUserProfile(userId);
      console.log("user", user);
      if (user) {
        res.status(STATUS_CODES.SUCCESS).json({ user });
      } else {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.USER.ERROR.FETCH_PROFILE });
      }
    } catch (error) {
      // res.status(400).json({ error: error.message });
      next(error);
    }
  }

  async getEditProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const user = await this.profileService.getUserProfile(userId);
      if (user) {
        res.status(STATUS_CODES.SUCCESS).json({ user });
      } else {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.USER.ERROR.FETCH_EDIT_PROFILE });
      }
    } catch (error) {
      // res.status(400).json({ error: error.message });
      next(error);
    }
  }

  async updateUserProfileHandler(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const updatedData = req.body;
      console.log("updatedData", updatedData);

      const updatedUser = await this.profileService.updateUserProfile(
        userId,
        updatedData,
      );

      if (updatedUser) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.USER.SUCCESS.PROFILE_UPDATE });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.USER.ERROR.PROFILE_UPDATE });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      next(error);
    }
  }
}

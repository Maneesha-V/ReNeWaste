import { NextFunction, Request, Response } from "express";
import { IProfileController } from "./interface/IProfileController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IProfileService } from "../../services/driver/interface/IProfileService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.DriverProfileService)
    private profileService: IProfileService
  ) {}
  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const driverId = req.user?.id;
      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const driver = await this.profileService.getDriverProfile(driverId);
      res.status(STATUS_CODES.SUCCESS).json({ driver });
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const driverId = req.user?.id;
      const updatedData = req.body;
      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const updatedDriver = await this.profileService.updateDriverProfile(
        driverId,
        updatedData
      );
      res.status(STATUS_CODES.SUCCESS).json({ updatedDriver });
    } catch (error) {
      next(error);
    }
  }
  async getDriversByWastePlant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const wastePlantId = req.query.wastePlantId as string;

      if (!wastePlantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const drivers = await this.profileService.fetchDriversService(
        wastePlantId
      );

      res.status(STATUS_CODES.SUCCESS).json({ drivers });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      next(error);
    }
  }
}

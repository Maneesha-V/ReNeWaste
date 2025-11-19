import { inject, injectable } from "inversify";
import { IRatingController } from "./interface/IRatingController";
import TYPES from "../../config/inversify/types";
import { IRatingService } from "../../services/user/interface/IRatingService";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { NextFunction, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class RatingController implements IRatingController {
  constructor(
    @inject(TYPES.UserRatingService)
    private _ratingService: IRatingService,
  ) {}
  async addUserRating(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
        const data = req.body.data;
    
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const success = await this._ratingService.addUserRating({userId, data});
      res
          .status(STATUS_CODES.CREATED)
          .json({ message: MESSAGES.COMMON.SUCCESS.RATING_SUCCESS });
    } catch (error) {
      next(error);
    }
  }
}
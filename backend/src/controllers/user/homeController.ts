import { Request, Response, NextFunction } from "express";
import { IHomeController } from "./interface/IHomeController";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IHomeService } from "../../services/user/interface/IHomeService";

@injectable()
export class HomeController implements IHomeController {
  constructor(
    @inject(TYPES.UserHomeService)
    private _homeSevice: IHomeService,
  ) {}
  async searchLocation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const location = req.query.location as string;
      console.log(location);
      if (!location) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.USER.ERROR.LOC_REQUIRED,
        );
      }
      const predictions = await this._homeSevice.searchLocation(location);

      res.status(STATUS_CODES.SUCCESS).json(predictions);
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async checkWPServiceAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const location = req.params.description as string;
      console.log(location);
      if (!location) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.USER.ERROR.PLACE_REQUIRED,
        );
      }
      const result =
        await this._homeSevice.checkWPServiceAvailability(location);

      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async checkCurrentLocation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const latitude = Number(req.query.latitude);
      const longitude = Number(req.query.longitude);
      console.log({ latitude, longitude });
      if (!latitude || !longitude) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.USER.ERROR.PLACE_REQUIRED,
        );
      }
      const result = await this._homeSevice.checkCurrentLocation(
        latitude,
        longitude,
      );

      res.status(STATUS_CODES.SUCCESS).json(result);
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}

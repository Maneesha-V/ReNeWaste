import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { ICommercialController } from "./interface/ICommercialController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ICommercialService } from "../../services/user/interface/ICommercialService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class CommercialController implements ICommercialController {
  constructor(
    @inject(TYPES.CommercialService)
    private commercialService: ICommercialService,
  ) {}
  async getCommercial(
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
      const user = await this.commercialService.getCommercialService(userId);
      console.log("user", user);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ user, message: MESSAGES.USER.SUCCESS.COMMERCIAL_PICKUP });
    } catch (error) {
      next(error);
    }
  }
  async checkServiceAvailable(
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
      const { service, wasteplantId } = req.body;

      const success = await this.commercialService.availableWasteService(
        service,
        wasteplantId,
      );

      if (success) {
        res.status(STATUS_CODES.SUCCESS).json({ available: true });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).json({ available: false });
      }
    } catch (error) {
      console.error("Error in checking service availability:", error);
      next(error);
    }
  }

  async updateCommercialPickup(
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
      console.log(req.body);

      const updatedData = req.body;
      const pickupDateString = updatedData.pickupDate;
      const formattedDate = moment(
        pickupDateString,
        "MM-DD-YYYY",
        true,
      ).toDate();

      if (isNaN(formattedDate.getTime())) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.USER.ERROR.PICKUP_DATE,
        );
      }
      updatedData.pickupDate = formattedDate;

      const success =
        await this.commercialService.updateCommercialPickupService(
          userId,
          updatedData,
        );

      if (success) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.USER.SUCCESS.PICKUP_CREATED });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.USER.ERROR.PICKUP_CREATED });
      }
    } catch (error) {
      console.error("Error in updation:", error);
      next(error);
    }
  }
}

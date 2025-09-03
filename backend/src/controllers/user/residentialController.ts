import { NextFunction, Request, Response } from "express";
import { IResidentialController } from "./interface/IResidentialController";
import moment from "moment";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IResidentialService } from "../../services/user/interface/IResidentialService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class ResidentialController implements IResidentialController {
  constructor(
    @inject(TYPES.ResidentialService)
    private residentialService: IResidentialService
  ) {}
  async getResidential(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const user = await this.residentialService.getResidentialService(userId);
      console.log("user", user);

      res.status(STATUS_CODES.SUCCESS).json({ user, message: MESSAGES.USER.SUCCESS.RESIDENTIAL_PICKUP });
    } catch (error) {
      next(error);
    }
  }
  async updateResidentialPickup(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const updatedData = req.body;
      console.log("updatedData", updatedData);

      const pickupDateString = updatedData.pickupDate;
      const formattedDate = moment(
        pickupDateString,
        "MM-DD-YYYY",
        true
      ).toDate();
      if (isNaN(formattedDate.getTime())) {
         throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.USER.ERROR.PICKUP_DATE
        );
      }

      updatedData.pickupDate = formattedDate;
      const success = await this.residentialService.updateResidentialPickupService(
        userId,
        updatedData
      );
      if(success){
        res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.USER.SUCCESS.PICKUP_CREATED });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.USER.ERROR.PICKUP_CREATED });
      }

    } catch (error) {
      console.error("Error in updation:", error);
      next(error);
    }
  }
}

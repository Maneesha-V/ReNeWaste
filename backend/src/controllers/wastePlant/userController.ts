import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IUserController } from "./interface/IUserController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserService } from "../../services/wastePlant/interface/IUserService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.PlantUserService)
    private _userService: IUserService
  ) {}
  async fetchUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        throw new ApiError(
                 STATUS_CODES.UNAUTHORIZED,
                 MESSAGES.COMMON.ERROR.UNAUTHORIZED
               );
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { users, total } = await this._userService.getAllUsers(
        wasteplantId,
        page,
        limit,
        search
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_USER,
        users,
        total,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async userBlockStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const { isBlocked } = req.body;
      const wasteplantId = req.user?.id;
      console.log({ userId, isBlocked, wasteplantId });

      if (!wasteplantId) {
        throw new ApiError(
                 STATUS_CODES.UNAUTHORIZED,
                 MESSAGES.COMMON.ERROR.UNAUTHORIZED
               );
      }
      if (typeof isBlocked !== "boolean") {
         throw new ApiError(STATUS_CODES.BAD_REQUEST, MESSAGES.COMMON.ERROR.INVALID_BLOCK)
      }
      const updatedUser = await this._userService.userBlockStatusService(
        wasteplantId,
        userId,
        isBlocked
      );
      console.log("updatedUser ", updatedUser);


      res.json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.BLOCK_UPDATE,
        updatedUser
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}

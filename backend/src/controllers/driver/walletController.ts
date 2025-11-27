import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletService } from "../../services/driver/interface/IWalletService";
import { IWalletController } from "./interface/IWalletController";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { NextFunction, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject(TYPES.DriverWalletService)
    private _walletService: IWalletService
  ) {}
  async getWallet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountId = req.user?.id;
      const accountType = "Driver";

      if (!accountId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { transactions, balance, total, rewards } =
        await this._walletService.getWallet(
          accountId,
          accountType,
          page,
          limit,
          search
        );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ transactions, balance, total, rewards });
    } catch (error) {
      console.log("wallet--error", error);

      next(error);
    }
  }
}

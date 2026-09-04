import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletController } from "./interface/IWalletController";
import { IWalletService } from "../../services/wastePlant/interface/IWalletService";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { NextFunction, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject(TYPES.PlantWalletService)
    private _walletService: IWalletService,
  ) {}
  async getWallet(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user?.id;
      const accountType = "WastePlant";

      if (!accountId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { transactions, balance, total, earnings } =
        await this._walletService.getWallet(
          accountId,
          accountType,
          page,
          limit,
          search,
        );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ transactions, balance, total, earnings });
    } catch (error) {
      console.log("wallet--error", error);
      next(error);
    }
  }
  async createAddMoneyOrder(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user?.id;
      const accountType = "WastePlant";

      const { data } = req.body;

      if (!accountId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const walletPayOrder = await this._walletService.createAddMoneyOrder({
        accountId,
        accountType,
        data,
      });

      res.status(STATUS_CODES.CREATED).json(walletPayOrder);
    } catch (error) {
      next(error);
    }
  }
  async verifyWalletAddPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user?.id;
      const accountType = "WastePlant";

      const { data } = req.body;

      if (!accountId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const walletVerPayOrder =
        await this._walletService.verifyWalletAddPayment({
          accountId,
          accountType,
          data,
        });

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.ADD_TO_WALLET,
        walletVerPayOrder,
      });
    } catch (error) {
      next(error);
    }
  }
  async retryWalletAddPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user?.id;
      const accountType = "WastePlant";
      const transactionId = req.body.transactionId;

      if (!accountId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const retryAddMoneyResp = await this._walletService.retryWalletAddPayment(
        accountId,
        accountType,
        transactionId,
      );

      res.status(STATUS_CODES.SUCCESS).json(retryAddMoneyResp);
    } catch (error) {
      next(error);
    }
  }
}

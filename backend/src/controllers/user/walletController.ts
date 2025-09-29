import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWalletController } from "./interface/IWalletController";
import { IWalletService } from "../../services/user/interface/IWalletService";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { NextFunction, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject(TYPES.UserWalletService)
    private _walletService: IWalletService,
  ) {}
  async createAddMoneyOrder(
      req: AuthRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const userId = req.user?.id;
        console.log("body",req.body);
        
        const { data } = req.body;
        console.log("data",data);
        
        if (!userId) {
          throw new ApiError(
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.COMMON.ERROR.UNAUTHORIZED,
          );
        }
        const walletPayOrder = await this._walletService.createAddMoneyOrder({userId, data});
        console.log("walletPayOrder", walletPayOrder);
  
        res
          .status(STATUS_CODES.CREATED)
          .json(walletPayOrder);
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
        const userId = req.user?.id;
        console.log("body",req.body);
        
        const { data } = req.body;
        console.log("data",data);
        
        if (!userId) {
          throw new ApiError(
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.COMMON.ERROR.UNAUTHORIZED,
          );
        }
        const walletVerPayOrder = await this._walletService.verifyWalletAddPayment({userId, data});
        console.log("res", res);
      
        res
          .status(STATUS_CODES.SUCCESS)
          .json({
            message: MESSAGES.COMMON.SUCCESS.ADD_TO_WALLET,
            walletVerPayOrder
          });
      } catch (error) {
        next(error);
      }
    }
    async getWallet(
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
        const userWallet = await this._walletService.getWallet(userId);
      
        res
          .status(STATUS_CODES.SUCCESS)
          .json({userWallet});
      } catch (error) {
        console.log("wallet--error",error);
        
        next(error);
      }
    }
    
       async retryWalletAddPayment(
      req: AuthRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const userId = req.user?.id;
        const transactionId = req.body.transactionId;

        if (!userId) {
          throw new ApiError(
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.COMMON.ERROR.UNAUTHORIZED,
          );
        }
        const retryAddMoneyResp = await this._walletService.retryWalletAddPayment(userId,transactionId);
      
        res
          .status(STATUS_CODES.SUCCESS)
          .json(retryAddMoneyResp);
      } catch (error) {
        console.log("wallet--error",error);
        
        next(error);
      }
    }
}
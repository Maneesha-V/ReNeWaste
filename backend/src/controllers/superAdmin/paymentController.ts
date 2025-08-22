import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/superAdmin/interface/IPaymentService";
import { AuthRequest } from "../../types/common/middTypes";
import { NextFunction, Response } from "express"
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { handleControllerError } from "../../utils/errorHandler";
@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.SuperAdminPaymentService)
    private paymentService: IPaymentService
  ) {}
   async fetchPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        console.log(req.query);
        const DEFAULT_LIMIT = 5;
        const MAX_LIMIT = 50;
        const page = parseInt(req.query.page as string) || 1;
        let limit = Math.min(
          parseInt(req.query.limit as string) || DEFAULT_LIMIT,
          MAX_LIMIT
        );
        const search = (req.query.search as string) || "";
        const { total, paymentHis } =
          await this.paymentService.fetchPayments({ page, limit, search });
      
        console.log({total, paymentHis});
  
        res.status(STATUS_CODES.SUCCESS).json({
          message: MESSAGES.SUPERADMIN.SUCCESS.PAYMENT_HISTORY,
          paymentHis,
          total
        });
      } catch (error) {
        next(error);
      }
    }
}
import { AuthRequest } from "../../types/common/middTypes";
import { Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/wastePlant/interface/IPaymentService";


@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.PlantPaymentService)
    private paymentService: IPaymentService
  ) {}
  async fetchPayments(req: AuthRequest, res: Response): Promise<void> {
     try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      // const page = parseInt(req.query.page as string) || 1;
      // const limit = parseInt(req.query.limit as string) || 5;
      // const search = (req.query.search as string) || "";

      const  paymentData  = await this.paymentService.fetchPayments(
        plantId
        // page,
        // limit,
        // search
      );
      console.log("paymentData", paymentData);

      res.status(200).json({
        success: true,
        paymentData
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching payments.", error });
    }
  }
}
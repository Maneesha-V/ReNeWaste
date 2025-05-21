import { Request, Response } from "express";
import { IResidentialController } from "./interface/IResidentialController";
import moment from "moment";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IResidentialService } from "../../services/user/interface/IResidentialService";

@injectable()
export class ResidentialController implements IResidentialController {
  constructor(
    @inject(TYPES.ResidentialService)
    private residentialService: IResidentialService
  ) {}
  async getResidential(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const user = await this.residentialService.getResidentialService(userId);
      console.log("user", user);

      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateResidentialPickup(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log("userId", userId);

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const updatedData = req.body;
      console.log("updatedData", updatedData);

      const pickupDateString = updatedData.pickupDate;
      const formattedDate = moment(
        pickupDateString,
        "MM-DD-YYYY",
        true
      ).toDate();
      console.log("formattedDate", formattedDate);
      if (isNaN(formattedDate.getTime())) {
        res.status(400).json({ message: "Invalid pickup date format" });
        return;
      }

      updatedData.pickupDate = formattedDate;
      const updatedUser =
        await this.residentialService.updateResidentialPickupService(
          userId,
          updatedData
        );
      console.log("updatedUser", updatedUser);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error in updation:", error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  }
}

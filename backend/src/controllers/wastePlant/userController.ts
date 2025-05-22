import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IUserController } from "./interface/IUserController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserService } from "../../services/wastePlant/interface/IUserService";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.PlantUserService)
    private userService: IUserService
  ) {}
  async fetchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { users, total } = await this.userService.getAllUsers(
        wasteplantId,
        page,
        limit,
        search
      );

      res.status(200).json({
        success: true,
        message: "Fetch users successfully",
        users,
        total,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching users.", error });
    }
  }

  async userBlockStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { isBlocked } = req.body;
      const wasteplantId = req.user?.id;
      console.log({ userId, isBlocked, wasteplantId });

      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }
      if (typeof isBlocked !== "boolean") {
        res.status(400).json({ message: "Invalid block status" });
        return;
      }
      const updatedUser = await this.userService.userBlockStatusService(
        wasteplantId,
        userId,
        isBlocked
      );
      console.log("updatedUser ", updatedUser);

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(updatedUser);
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ message: "Error toggling user block status.", error });
    }
  }
}

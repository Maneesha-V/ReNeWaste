import { Response, NextFunction } from "express";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { UserModel } from "../models/user/userModel";
import { MESSAGES, STATUS_CODES } from "../utils/constantUtils";
import { AuthRequest } from "../dtos/base/BaseDTO";

export const checkWastePlantNotBlocked = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (role !== "user") {
    return next();
  }

  const user = await UserModel.findById(userId);
  console.log("user34",user);
  if (!user || !user.wasteplantId) {
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ message: MESSAGES.USER.ERROR.NOT_FOUND });
    return;
  }

  const wastePlant = await WastePlantModel.findById(user.wasteplantId);
  console.log("wastePlant12",wastePlant);
  
  if (!wastePlant) {
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ message: MESSAGES.WASTEPLANT.ERROR.NOT_FOUND });
    return;
  }

  if (wastePlant.isBlocked) {
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ 
        reason: "WASTEPLANT_BLOCKED",
        message: MESSAGES.USER.ERROR.WASTEPLANT_BLOCK 
      });
    return;
  }

  next();
};

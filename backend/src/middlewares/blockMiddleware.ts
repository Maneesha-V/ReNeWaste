import { Response, NextFunction } from "express";
import { UserModel } from "../models/user/userModel";
import { MESSAGES, STATUS_CODES } from "../utils/constantUtils";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { AuthRequest } from "../dtos/base/BaseDTO";

export const checkNotBlocked = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || !role) {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
    return;
  }
  let entity;

  if (role === "user") {
    entity = await UserModel.findById(id);
  } else if (role === "wasteplant") {
    entity = await WastePlantModel.findById(id);
  } else {
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ message: MESSAGES.COMMON.ERROR.INVALID_ROLE });
    return;
  }

  if (!entity || entity.isBlocked) {
    res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ message: MESSAGES.COMMON.ERROR.BLOCKED });
    return;
  }
  next();
};

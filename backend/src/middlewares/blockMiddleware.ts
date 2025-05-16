import { Response, NextFunction } from "express";
import { UserModel } from "../models/user/userModel";
import { AuthRequest } from "../types/common/middTypes";


export const checkNotBlocked = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id; 

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await UserModel.findById(userId);

  if (!user || user.isBlocked) {
    res.status(403).json({ message: "Your account has been blocked by the waste plant" });
    return;
  }

  next();
};

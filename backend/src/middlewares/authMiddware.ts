import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user/userModel";
import { CustomRequest } from "../types/user/profileTypes"; 
import mongoose from "mongoose";

export const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Received Token:", token); 
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    // console.log("Decoded Token:", decoded);
    // const user = await UserModel.findById(decoded.id).select("-password");
    const user = await UserModel.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");
    // console.log("User Found:", user);
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = { id: user._id.toString() }; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

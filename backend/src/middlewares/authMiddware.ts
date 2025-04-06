import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user/userModel";
import { CustomRequest } from "../types/user/profileTypes"; 
import mongoose from "mongoose";
import { SuperAdminModel } from "../models/superAdmin/superAdminModel";

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
export const authenticateSuperAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token); 
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded Token:", decoded);
    // const superadmin = await UserModel.findById(decoded.id).select("-password");
    const superadmin = await SuperAdminModel.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");
    console.log("superadmin Found:", superadmin);
    // if (!user) return res.status(404).json({ error: "superadmin not found" });

    // req.superadmin = { id: superadmin._id.toString() }; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// export const authenticateSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; // Expecting: Bearer <token>

//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

//     // Option 1: If role is included in token
//     if (decoded.role !== "superadmin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Option 2 (optional): If you want to verify from DB
//     // const superAdmin = await User.findById(decoded.id);
//     // if (!superAdmin || !superAdmin.isSuperAdmin) return res.status(403).json({ message: "Access denied" });

//     req.user = decoded; // attach decoded user to request
//     next();
//   } catch (error) {
//     console.error("Auth error:", error);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

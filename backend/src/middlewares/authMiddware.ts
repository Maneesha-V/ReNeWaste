import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user/userModel";
import { ProfileRequest } from "../types/user/profileTypes"; 
import mongoose from "mongoose";
import { SuperAdminModel } from "../models/superAdmin/superAdminModel";
import { DriverModel } from "../models/driver/driverModel";
import { ProfileDriverRequest } from "../types/driver/authTypes";
import { ProfilePlantRequest } from "../types/wastePlant/authTypes";
import { WastePlantModel } from "../models/wastePlant/wastePlantModel";
import { AuthRequest } from "../types/common/middTypes";

export const authenticateUser = async (req: ProfileRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token); 
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await UserModel.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = { id: user._id.toString() }; 
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authenticateSuperAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token); 
    
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    // const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    // console.log("Decoded Token:", decoded);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    console.log("Decoded Token in middleware:", decoded);

    const superadmin = await SuperAdminModel.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");
    console.log("superadmin Found:", superadmin);

 if (!superadmin) {
      return res.status(404).json({ error: "SuperAdmin not found" });
    }

    req.user = { id: superadmin._id.toString(), role: superadmin.role }; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
export const authenticateDriver = async (req: ProfileDriverRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const driver = await DriverModel.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");
    console.log("driver Found:", driver);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    req.driver = { driverId: driver._id.toString() };

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
export const authenticateWastePlant = async (req: ProfilePlantRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const wastePlant = await WastePlantModel.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");
    console.log("plant Found:", wastePlant);
    if (!wastePlant) {
      return res.status(404).json({ error: "wastePlant not found" });
    }
    req.wastePlant = { plantId: wastePlant._id.toString() };

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
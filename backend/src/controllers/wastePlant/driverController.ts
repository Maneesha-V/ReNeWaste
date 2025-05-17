import { Request, Response } from "express";
import { IDriverController } from "./interface/IDriverController";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import DriverService from "../../services/wastePlant/driverService";
import mongoose from "mongoose";
import { AuthRequest } from "../../types/common/middTypes";

class DriverController implements IDriverController {

async addDriver (req: AuthRequest, res: Response): Promise<void> {
  try {
    const plantId = req.user?.id;
    console.log("plantId",plantId);
    console.log("body",req.body);
    const { files } = req as any;
    console.log("files",files);
    if (!files?.licenseFront || !files?.licenseBack) {
      res.status(400).json({ error: "Both license front and back images are required" });
      return;
    }

    const licenseFrontPath = files.licenseFront[0].path;
    const licenseBackPath = files.licenseBack[0].path;
    const driverData: IDriver = {
      ...req.body,
      licenseNumber: req.body.licenseNumber?.trim(),
      experience: Number(req.body.experience), 
      licenseFront: licenseFrontPath,
      licenseBack: licenseBackPath,
      wasteplantId: new mongoose.Types.ObjectId(plantId), 
    } 
    console.log("driver",driverData);
    
    const newDriver = await DriverService.addDriver(driverData);
    console.log("✅ Inserted Driver:", newDriver);
    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      data: newDriver,
    });
  } catch (error: any) {
    console.error("err",error)
    res.status(500).json({ error: error.message || "Failed to create driver." });
  }
};

async fetchDrivers (req: AuthRequest,res: Response): Promise<void> {
  try {
    const plantId = req.user?.id;
     if (!plantId) {
      res.status(404).json({ message: "plantId not found" });
      return;
    }
console.log(req.query);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || "";

    const {drivers, total} = await DriverService.getAllDrivers(plantId, page, limit, search)   
    console.log("drivers",drivers,total);
    
    res.status(200).json({
      success: true,
      message: "Fetch drivers successfully",
      drivers,
      total
    });
  }catch (error:any){
    console.error("err",error);
    res.status(500).json({ message: "Error fetching drivers.", error });
  }
}
async getDriverById (req: Request,res: Response): Promise<void> {
  try {
    console.log(req.params);
    
    const { driverId } = req.params;
    const driver = await DriverService.getDriverByIdService(driverId);
    console.log("driver",driver);
    
    if (!driver) {
      res.status(404).json({ message: "Driver not found" });
      return;
    }

    res.status(200).json({ data: driver });
  } catch (error: any) {
    console.error("Error fetching Driver:", error);
    res.status(500).json({ message: "Server error" });
  }
}
async updateDriver (req: Request,res: Response): Promise<void> {
  try {
    console.log("body",req.body);
    
    const { driverId } = req.params;
    const { files } = req as any;
    if (!driverId) {
      res.status(400).json({ message: "Driver ID is required" });
      return;
    }
    const updatedData = req.body;
    if (files?.licenseFront) {
      updatedData.licenseFront = files.licenseFront[0].path;
    }

    if (files?.licenseBack) {
      updatedData.licenseBack = files.licenseBack[0].path;
    }

    if (updatedData.experience) {
      updatedData.experience = Number(updatedData.experience);
    }
    const updatedDriver = await DriverService.updateDriverByIdService(driverId, updatedData);

    if (!updatedDriver) {
      res.status(404).json({ message: "Driver not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedDriver,
    });
  } catch (error: any) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Server error" });
  }
}
async deleteDriverById (req: Request,res: Response): Promise<void> {
  try {
    console.log("body",req.body);
    const { driverId } = req.params;
    const result = await DriverService.deleteDriverByIdService(driverId);
    console.log("result-delete",result);
    if (!result) {
      res.status(404).json({ message: "Driver not found" });
      return;
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleting driver:", error);
    res.status(500).json({ message: "Server error" });
  }
}
}
export default new DriverController();
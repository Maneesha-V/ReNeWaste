import { Request, Response } from "express";
import { IDriverController } from "./interface/IDriverController";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import DriverService from "../../services/wastePlant/driverService";

class DriverController implements IDriverController {

async addDriver (req: Request, res: Response): Promise<void> {
  try {
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
      experience: Number(req.body.experience), 
      licenseFront: licenseFrontPath,
      licenseBack: licenseBackPath,
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

async fetchDrivers (req: Request,res: Response): Promise<void> {
  try {
    const drivers = await DriverService.getAllDrivers()   
    res.status(200).json({
      success: true,
      message: "Fetch drivers successfully",
      data: drivers,
    });
  }catch (error:any){
    console.error("err",error);
    res.status(500).json({ message: "Error fetching drivers.", error });
  }
}

}
export default new DriverController();
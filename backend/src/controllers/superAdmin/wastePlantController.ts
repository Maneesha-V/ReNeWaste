import { Request, Response } from "express";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import  WastePlantService  from "../../services/superAdmin/wastePlantService";
import { IWastePlantController } from "./interface/IWastePlantController";

class WastePlantController implements IWastePlantController {

async addWastePlant (req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "License document is required" });
      return;
    }

    const filePath = req.file.path;
    const wastePlantData: IWastePlant = {
      ...req.body,
      capacity: Number(req.body.capacity), 
      licenseDocumentPath: filePath,
    } as IWastePlant;
    console.log("wastePlantData",wastePlantData);
    
    const newWastePlant = await WastePlantService.addWastePlant(wastePlantData);
    console.log("✅ Inserted Waste Plant:", newWastePlant);
    res.status(201).json({
      success: true,
      message: "Waste plant created successfully",
      data: newWastePlant,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create waste plant" });
  }
};
async fetchWastePlants (req: Request,res: Response): Promise<void> {
  try {
    const wastePlants = await WastePlantService.getAllWastePlants()   
    res.status(200).json({
      success: true,
      message: "Fetch waste plants successfully",
      data: wastePlants,
    });
  }catch (error:any){
    console.error("err",error);
    res.status(500).json({ message: "Error fetching waste plants", error });
  }
}
async getWastePlantById (req: Request,res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const wastePlant = await WastePlantService.getWastePlantByIdService(id);
    console.log("data",wastePlant);
    
    if (!wastePlant) {
      res.status(404).json({ message: "Waste Plant not found" });
      return;
    }

    res.status(200).json({ data: wastePlant });
  } catch (error: any) {
    console.error("Error fetching waste plant:", error);
    res.status(500).json({ message: "Server error" });
  }
}
}
export default new WastePlantController();
import { Request, Response } from "express";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import  WastePlantService  from "../../services/superAdmin/wastePlantService";
import { IWastePlantController } from "./interface/IWastePlantController";

class WastePlantController implements IWastePlantController {

async addWastePlant (req: Request, res: Response): Promise<void> {
  try {
    console.log("body",req.body);
    
    if (!req.file) {
      res.status(400).json({ error: "License document is required" });
      return;
    }

    const filePath = req.file.path;

    let services: string[] = [];
    if (Array.isArray(req.body.services)) {
      services = req.body.services;
    } else if (typeof req.body.services === "string") {
      services = [req.body.services]; 
    }

    const wastePlantData: IWastePlant = {
      ...req.body,
      district: "Malappuram", 
      taluk: req.body.taluk,    
      pincode: req.body.pincode,              
      capacity: Number(req.body.capacity), 
      services,
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
    console.error("err",error)
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
    console.log("wastePlant",wastePlant);
    
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
async updateWastePlant (req: Request,res: Response): Promise<void> {
  try {
    console.log("body",req.body);
    
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Super Admin ID is required" });
      return;
    }
    const updatedData = req.body;
    if (req.file) {
      updatedData.licenseDocumentPath = req.file.path;
    }

    if (updatedData.capacity) {
      updatedData.capacity = Number(updatedData.capacity);
    }
    const updatedWastePlant = await WastePlantService.updateWastePlantByIdService(id,updatedData);
    console.log("wastePlant",updatedWastePlant);
    if (!updatedWastePlant) {
      res.status(404).json({ message: "Waste plant not found" });
      return;
    }
    res.status(200).json({ message: "Waste Plant updated successfully", wastePlant: updatedWastePlant });
  } catch (error: any) {
    console.error("Error updating waste plant:", error);
    res.status(500).json({ message: "Server error" });
  }
}
async deleteWastePlantById (req: Request,res: Response): Promise<void> {
  try {
    console.log("body",req.body);
    const { id } = req.params;
    const result = await WastePlantService.deleteWastePlantByIdService(id);

    if (!result) {
      res.status(404).json({ message: "Waste Plant not found" });
      return;
    }

    res.status(200).json({ message: "Waste Plant deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleting waste plant:", error);
    res.status(500).json({ message: "Server error" });
  }
}
}
export default new WastePlantController();
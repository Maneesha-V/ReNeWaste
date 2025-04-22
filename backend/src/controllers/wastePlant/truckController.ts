import { Request, Response } from "express";
import mongoose from "mongoose";
import { ProfilePlantRequest } from "../../types/wastePlant/authTypes";
import { ITruckController } from "./interface/ITruckController";
import { ITruck } from "../../models/truck/interfaces/truckInterface";
import TruckService from "../../services/wastePlant/truckService";
class TruckController implements ITruckController {

async addTruck (req: ProfilePlantRequest, res: Response): Promise<void> {
  try {
    const plantId = req.wastePlant?.plantId;
    console.log("plantId",plantId);
    console.log("body",req.body);

    const truckData: ITruck = {
      ...req.body,
      capacity: Number(req.body.capacity),
      wasteplantId: new mongoose.Types.ObjectId(plantId), 
    } 

    const newTruck = await TruckService.addTruck(truckData);
    console.log("✅ Inserted Truck:", newTruck);
    res.status(201).json({
      success: true,
      message: "Truck created successfully",
      data: newTruck,
    });
  } catch (error: any) {
    console.error("err",error)
    res.status(500).json({ error: error.message || "Failed to create truck." });
  }
};

async fetchTrucks (req: Request,res: Response): Promise<void> {
  try {
    const trucks = await TruckService.getAllTrucks()   

    res.status(200).json({
      success: true,
      message: "Fetch trucks successfully",
      data: trucks,
    });
  }catch (error:any){
    console.error("err",error);
    res.status(500).json({ message: "Error fetching trucks.", error });
  }
}
async fetchAvailableTrucks (req: Request,res: Response): Promise<void> {
  try {
    const { driverId } = req.query;
    if (typeof driverId !== "string") {
      res.status(400).json({ message: "Invalid or missing driverId" });
      return;
    }

    const trucks = await TruckService.getAvailableTrucks(driverId)   
    console.log("trucks",trucks);
    res.status(200).json({
      success: true,
      message: "Fetch trucks successfully",
      data: trucks,
    });
  }catch (error:any){
    console.error("err",error);
    res.status(500).json({ message: "Error fetching trucks.", error });
  }
}
async getTruckById (req: Request,res: Response): Promise<void> {
  try {
    const { truckId } = req.params;
    const truck = await TruckService.getTruckByIdService(truckId);
    if (!truck) {
      res.status(404).json({ message: "Truck not found" });
      return;
    }

    res.status(200).json({ data: truck });
  } catch (error: any) {
    console.error("Error fetching truck:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async updateTruck (req: Request,res: Response): Promise<void> {
  try {
    const { truckId } = req.params;
    if (!truckId) {
      res.status(400).json({ message: "Truck ID is required" });
      return;
    }
    const updatedData = req.body;

    if (updatedData.capacity) {
      updatedData.capacity = Number(updatedData.capacity);
    }
    const updatedTruck = await TruckService.updateTruckByIdService(truckId, updatedData);

    if (!updatedTruck) {
      res.status(404).json({ message: "Truck not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Truck updated successfully",
      data: updatedTruck,
    });
  } catch (error: any) {
    console.error("Error updating truck:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async deleteTruckById (req: Request,res: Response): Promise<void> {
  try {
    const { truckId } = req.params;
    const result = await TruckService.deleteTruckByIdService(truckId);
    if (!result) {
      res.status(404).json({ message: "Truck not found" });
      return;
    }

    res.status(200).json({ message: "Truck deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleting truck:", error);
    res.status(500).json({ message: "Server error" });
  }
}
}
export default new TruckController();
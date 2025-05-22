import { Request, Response } from "express";
import mongoose from "mongoose";
import { ITruckController } from "./interface/ITruckController";
import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckService } from "../../services/wastePlant/interface/ITruckService";

@injectable()
export class TruckController implements ITruckController {
  constructor(
    @inject(TYPES.PlantTruckService)
    private truckService: ITruckService
  ) {}
  async addTruck(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;
      console.log("plantId", plantId);
      console.log("body", req.body);

      const truckData: ITruck = {
        ...req.body,
        capacity: Number(req.body.capacity),
        wasteplantId: new mongoose.Types.ObjectId(plantId),
      };

      const newTruck = await this.truckService.addTruck(truckData);
      console.log("✅ Inserted Truck:", newTruck);
      res.status(201).json({
        success: true,
        message: "Truck created successfully",
        data: newTruck,
      });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to create truck." });
    }
  }

  async fetchTrucks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { trucks, total } = await this.truckService.getAllTrucks(
        plantId,
        page,
        limit,
        search
      );
      console.log("trucks", trucks);

      res.status(200).json({
        success: true,
        message: "Fetch trucks successfully",
        trucks,
        total,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching trucks.", error });
    }
  }
  async fetchAvailableTrucks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { driverId } = req.query;
      if (typeof driverId !== "string") {
        res.status(400).json({ message: "Invalid or missing driverId" });
        return;
      }
      console.log();

      const trucks = await this.truckService.getAvailableTrucksService(
        driverId
      );
      console.log("trucks", trucks);
      res.status(200).json({
        success: true,
        message: "Fetch trucks successfully",
        data: trucks,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching trucks.", error });
    }
  }
  async getTruckById(req: Request, res: Response): Promise<void> {
    try {
      const { truckId } = req.params;
      const truck = await this.truckService.getTruckByIdService(truckId);
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

  async updateTruck(req: Request, res: Response): Promise<void> {
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
      const updatedTruck = await this.truckService.updateTruckByIdService(
        truckId,
        updatedData
      );

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

  async deleteTruckById(req: Request, res: Response): Promise<void> {
    try {
      const { truckId } = req.params;
      const result = await this.truckService.deleteTruckByIdService(truckId);
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
  async getAvailableTruckReqsts(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      const pendingTruckReqsts = await this.truckService.pendingTruckReqsts(
        plantId
      );
      console.log("pendingTruckReqsts", pendingTruckReqsts);

      res.status(200).json({
        success: true,
        message: "Fetch avaialable truck requests successfully",
        data: pendingTruckReqsts,
      });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ message: "Error fetching avaialable truck requests.", error });
    }
  }

  async getTrucksForDriver(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;
      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      const availableTrucks = await this.truckService.availableTrucksForDriver(
        plantId
      );
      console.log("availableTrucks", availableTrucks);

      res.status(200).json({
        success: true,
        message: "Fetch avaialable trucks successfully",
        data: availableTrucks,
      });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ message: "Error fetching avaialable trucks.", error });
    }
  }
  async assignTruckToDriver(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;
      const { driverId, truckId, prevTruckId } = req.body;
      console.log("plantId", plantId);
      console.log(req.body);

      if (!plantId || !driverId || !truckId || !prevTruckId) {
        res.status(400).json({ message: "Missing id's are required" });
        return;
      }

      const updatedRequests =
        await this.truckService.assignTruckToDriverService(
          plantId,
          driverId,
          truckId,
          prevTruckId
        );
      console.log("updatedRequest", updatedRequests);

      res.status(200).json({
        data: updatedRequests,
        success: true,
        message: "Assign truck to driver successfully",
      });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ message: "Error assigning truck to driver.", error });
    }
  }
}

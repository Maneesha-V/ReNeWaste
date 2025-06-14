import { Request, Response } from "express";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantController } from "./interface/IWastePlantController";
import { AuthRequest } from "../../types/common/middTypes";
import TYPES from "../../config/inversify/types";
import { inject, injectable } from "inversify";
import { IWastePlantService } from "../../services/superAdmin/interface/IWastePlantService";

@injectable()
export class WastePlantController implements IWastePlantController {
  constructor(
    @inject(TYPES.SuperAdminPlantService)
    private wastePlantService: IWastePlantService
  ) {}
  async addWastePlant(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);

      if (!req.file) {
        res.status(400).json({ error: "License document is required" });
        return;
      }

      const filePath = req.file.path;

      let services: string[] = [];
      const rawServices = req.body.services;

      if (Array.isArray(rawServices)) {
        services = rawServices.flatMap((s) =>
          typeof s === "string" ? s.split(",").map((item) => item.trim()) : []
        );
      } else if (typeof rawServices === "string") {
        services = rawServices.split(",").map((item) => item.trim());
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
      console.log("wastePlantData", wastePlantData);

      const newWastePlant = await this.wastePlantService.addWastePlant(
        wastePlantData
      );
      console.log("✅ Inserted Waste Plant:", newWastePlant);
      res.status(201).json({
        success: true,
        message: "Waste plant created successfully",
        data: newWastePlant,
      });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to create waste plant" });
    }
  }
  async fetchWastePlants(req: AuthRequest, res: Response): Promise<void> {
    try {
      const wastePlants = await this.wastePlantService.getAllWastePlants();
      res.status(200).json({
        success: true,
        message: "Fetch waste plants successfully",
        data: wastePlants,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching waste plants", error });
    }
  }
  async getWastePlantById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const wastePlant = await this.wastePlantService.getWastePlantByIdService(
        id
      );
      console.log("wastePlant", wastePlant);

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
  async updateWastePlant(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);

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
      const rawServices = req.body.services;

      if (Array.isArray(rawServices)) {
        updatedData.services = rawServices.flatMap((s) =>
          typeof s === "string" ? s.split(",").map((item) => item.trim()) : []
        );
      } else if (typeof rawServices === "string") {
        updatedData.services = rawServices
          .split(",")
          .map((item) => item.trim());
      }
      const updatedWastePlant =
        await this.wastePlantService.updateWastePlantByIdService(
          id,
          updatedData
        );
      console.log("wastePlant", updatedWastePlant);
      if (!updatedWastePlant) {
        res.status(404).json({ message: "Waste plant not found" });
        return;
      }
      res
        .status(200)
        .json({
          message: "Waste Plant updated successfully",
          wastePlant: updatedWastePlant,
        });
    } catch (error: any) {
      console.error("Error updating waste plant:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async deleteWastePlantById(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { id } = req.params;
      const result = await this.wastePlantService.deleteWastePlantByIdService(
        id
      );

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
  async sendSubscribeNotification(req: AuthRequest, res: Response): Promise<void> {
 try {
  const adminId = req.user?.id;
  if(!adminId){
           res.status(404).json({ message: "Unauthorized Id is not found." });
        return;
  }
      const plantId = req.params.id;
      await this.wastePlantService.sendSubscribeNotification(
        {adminId, plantId}
      );

      res.status(200).json({ message: "Send notification successfully" });
    } catch (error: any) {
      console.error("Error in sending notification:", error);
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
}
